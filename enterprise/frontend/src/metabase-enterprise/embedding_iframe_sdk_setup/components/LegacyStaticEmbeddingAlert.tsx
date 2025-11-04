import { replace } from "react-router-redux";
import { c, t } from "ttag";

import { useDispatch } from "metabase/lib/redux";
import * as Urls from "metabase/lib/urls";
import { Alert, Anchor, Box, Flex, Icon, Stack, Text } from "metabase/ui";
import { useSdkIframeEmbedSetupContext } from "metabase-enterprise/embedding_iframe_sdk_setup/context";
import { getResourceTypeFromExperience } from "metabase-enterprise/embedding_iframe_sdk_setup/utils/get-resource-type-from-experience";
import type { Card, Dashboard } from "metabase-types/api";

export const LegacyStaticEmbeddingAlert = () => {
  const { settings, resource, experience, onClose } =
    useSdkIframeEmbedSetupContext();

  const dispatch = useDispatch();
  const isStaticEmbedding = !!settings.isStatic;

  const resourceType = getResourceTypeFromExperience(experience);
  const shouldShowForResource =
    resourceType === "dashboard" || resourceType === "question";

  if (
    !isStaticEmbedding ||
    !resource ||
    !resourceType ||
    !shouldShowForResource
  ) {
    return null;
  }

  const shouldShowLegacyStaticEmbeddingAlert =
    resource.enable_embedding && resource.embedding_type === "static-legacy";

  if (!shouldShowLegacyStaticEmbeddingAlert) {
    return null;
  }

  return (
    <Alert color="info" variant="outline">
      <Flex gap="sm">
        <Box>
          <Icon color="var(--mb-color-text-secondary)" name="info" mt="2px" />
        </Box>

        <Stack>
          <Text key="legacy-static-embedding-alert" c="text-primary" lh="lg">
            {t`This embed uses the legacy static embedding method. The controls shown are for the new embedding method, which is recommended.`}
          </Text>

          <Anchor
            key="anchor"
            fw="bold"
            lh="lg"
            onClick={() => {
              onClose();

              dispatch(
                replace({
                  pathname:
                    resourceType === "dashboard"
                      ? Urls.dashboardStaticLegacyWizard(
                          (resource as Dashboard).id,
                        )
                      : Urls.questionStaticLegacyWizard((resource as Card).id),
                  state: { preserveNavbarState: true },
                }),
              );
            }}
          >
            {c("A link that toggles the legacy static embedding wizard.")
              .t`Use legacy static embedding (not recommended)`}
          </Anchor>
        </Stack>
      </Flex>
    </Alert>
  );
};
