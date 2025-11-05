import type { ReactElement } from "react";
import { t } from "ttag";

import { FormRadioGroup } from "metabase/forms";
import { Box, Card, Divider, Flex, Radio, Text } from "metabase/ui";

interface IMetabotRadioProps {
  value: string;
  title: string;
  description: string;
  price: string;
}

function MetabotRadio({
  value,
  title,
  description,
  price,
}: IMetabotRadioProps): ReactElement {
  return (
    <Box p="md">
      <Radio
        value={value}
        label={
          <Flex
            align="flex-start"
            direction={{ base: "column", sm: "row" }}
            justify="space-between"
            wrap="nowrap"
            w="100%"
          >
            <Text fw="bold" miw="35%" ta="left">
              {title}
            </Text>

            <Text ta="left">{description}</Text>

            <Text fw="bold" ta={{ base: "left", sm: "right" }}>
              {price}
            </Text>
          </Flex>
        }
        w="100%"
      />
    </Box>
  );
}

export function MetabotRadios(): ReactElement {
  return (
    <FormRadioGroup
      name="quantity"
      labelElement="div"
      onChange={(value) => console.warn(value)}
    >
      <Card withBorder p={0}>
        <MetabotRadio
          value="500"
          title={t`Small`}
          description={t`up to 500 requests/month`}
          price={t`$100/month`}
        />
        <Divider />
        <MetabotRadio
          value="1500"
          title={t`Medium`}
          description={t`up to 1500 requests/month`}
          price={t`$300/month`}
        />
        <Divider />
        <MetabotRadio
          value="2500"
          title={t`Large`}
          description={t`up to 2500 requests/month`}
          price={t`$500/month`}
        />
      </Card>
    </FormRadioGroup>
  );
}
