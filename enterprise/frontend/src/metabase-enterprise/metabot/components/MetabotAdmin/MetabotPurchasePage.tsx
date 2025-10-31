import { useDisclosure } from "@mantine/hooks";
import { useCallback } from "react";
import { t } from "ttag";
import * as Yup from "yup";

import {
  SettingsPageWrapper,
  SettingsSection,
} from "metabase/admin/components/SettingsSection";
import { getCurrentUser } from "metabase/admin/datamodel/selectors";
import { usePurchaseCloudAddOnMutation } from "metabase/api";
import ExternalLink from "metabase/common/components/ExternalLink";
import { useSetting } from "metabase/common/hooks";
import {
  Form,
  FormCheckbox,
  FormProvider,
  FormRadioGroup,
  FormSubmitButton,
} from "metabase/forms";
import { useSelector } from "metabase/lib/redux";
import { Flex, Group, Radio, Stack, Text } from "metabase/ui";

import { MetabotSettingUpModal } from "./MetabotSettingUpModal";
import { handleFieldError, isFetchBaseQueryError } from "./utils";

const validationSchema = Yup.object({
  quantity: Yup.string(),
  terms_of_service: Yup.boolean(),
});

interface MetabotPurchaseFormFields {
  quantity: string;
  terms_of_service: boolean;
}

export const MetabotPurchasePage = () => {
  const currentUser = useSelector(getCurrentUser);
  const tokenStatus = useSetting("token-status");
  const storeUserEmails =
    tokenStatus?.["store-users"]?.map(({ email }) => email.toLowerCase()) ?? [];
  const isStoreUser = storeUserEmails.includes(
    currentUser?.email.toLowerCase(),
  );
  const anyStoreUserEmailAddress =
    storeUserEmails.length > 0 ? storeUserEmails[0] : undefined;

  const [settingUpModalOpened, settingUpModalHandlers] = useDisclosure(false);
  const [purchaseCloudAddOn] = usePurchaseCloudAddOnMutation();
  const onSubmit = useCallback(
    async ({ quantity, terms_of_service }: MetabotPurchaseFormFields) => {
      settingUpModalHandlers.open();
      await purchaseCloudAddOn({
        product_type: "metabase-ai-tiered",
        quantity: parseInt(quantity, 10),
        terms_of_service,
      })
        .unwrap()
        .catch((error: unknown) => {
          settingUpModalHandlers.close();
          isFetchBaseQueryError(error) && handleFieldError(error.data);
        });
    },
    [purchaseCloudAddOn, settingUpModalHandlers],
  );

  return (
    <SettingsPageWrapper title={t`Metabot AI`}>
      <Text>{t`Metabot helps you move faster and understand your data better. You can ask it to generate SQL, and build or explain queries.`}</Text>
      {isStoreUser ? (
        <SettingsSection title={t`Monthly usage limit`}>
          <FormProvider
            initialValues={{ quantity: "500", terms_of_service: false }}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            {({ values }) => (
              <Form>
                <Stack>
                  <Text>{t`Usage is measured in Metabot requests. If a chat has multiple questions, they are counted as separate Metabot requests. Usage limit applies to your whole organization.`}</Text>{" "}
                  <FormRadioGroup name="quantity">
                    <Stack mt="md">
                      <Radio
                        value="500"
                        label={
                          <>
                            <Text fw="bold">{t`Small`}</Text>
                            <Text>{t`up to 500 requests/month`}</Text>
                            <Text fw="bold">{t`$100/month`}</Text>
                          </>
                        }
                      />
                      <Radio
                        value="1500"
                        label={
                          <>
                            <Text fw="bold">{t`Medium`}</Text>
                            <Text>{t`up to 1500 requests/month`}</Text>
                            <Text fw="bold">{t`$300/month`}</Text>
                          </>
                        }
                      />
                      <Radio
                        value="2500"
                        label={
                          <>
                            <Text fw="bold">{t`Large`}</Text>
                            <Text>{t`up to 2500 requests/month`}</Text>
                            <Text fw="bold">{t`$500/month`}</Text>
                          </>
                        }
                      />
                    </Stack>
                  </FormRadioGroup>
                  {/* eslint-disable-next-line no-literal-metabase-strings -- This string only shows for admins." */}
                  <Text>{t`Additional amount for the add-on will be added to your next billing period invoice. You can cancel the add-on anytime in Metabase Store.`}</Text>
                  <FormCheckbox
                    name="terms_of_service"
                    label={
                      <Text>
                        {t`I agree with the Metabot AI add-on`}{" "}
                        <ExternalLink href="https://www.metabase.com/license/hosting">{t`Terms of Service`}</ExternalLink>
                      </Text>
                    }
                  />
                  <Flex justify="start">
                    <Group align="center" gap="sm">
                      <FormSubmitButton
                        disabled={!values.terms_of_service}
                        label={t`Confirm purchase`}
                        variant="filled"
                        mt="xs"
                      />
                    </Group>
                  </Flex>
                </Stack>
              </Form>
            )}
          </FormProvider>
        </SettingsSection>
      ) : (
        <Text fw="bold">
          {
            /* eslint-disable-next-line no-literal-metabase-strings -- This string only shows for admins. */
            t`Please ask a Metabase Store Admin${anyStoreUserEmailAddress && ` (${anyStoreUserEmailAddress})`} of your organization to enable this for you.`
          }
        </Text>
      )}
      <MetabotSettingUpModal
        opened={settingUpModalOpened}
        onClose={() => {
          settingUpModalHandlers.close();
          window.location.reload();
        }}
      />
    </SettingsPageWrapper>
  );
};
