import { Fragment, type ReactElement, useState } from "react";
import { t } from "ttag";

import { FormRadioGroup } from "metabase/forms";
import { Box, Card, Divider, Flex, Radio, Text } from "metabase/ui";

import { METABOT_AI_TIERS } from "./constants";
import type { IMetabotRadioProps } from "./types";

function MetabotRadio({
  selected,
  value,
  title,
  description,
  price,
}: IMetabotRadioProps): ReactElement {
  return (
    <Box
      bg={selected ? "var(--mb-color-brand-light)" : undefined}
      p="md"
      w="100%"
    >
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
  const [FIRST_METABOT_AI_TIER] = METABOT_AI_TIERS;
  const [selectedQuantity, setSelectedQuantity] = useState(
    FIRST_METABOT_AI_TIER.quantity,
  );

  return (
    <FormRadioGroup
      defaultValue={FIRST_METABOT_AI_TIER.quantity}
      name="quantity"
      labelElement="div"
      onChange={(value) => setSelectedQuantity(value)}
      w="100%"
    >
      <Card withBorder p={0} w="100%">
        {METABOT_AI_TIERS.map(
          ({ quantity, title, description, price }, index) => (
            <Fragment key={index}>
              {index > 0 && <Divider />}

              <MetabotRadio
                selected={quantity === selectedQuantity}
                value={quantity}
                title={t`${title}`}
                description={t`${description}`}
                price={t`${price}`}
              />
            </Fragment>
          ),
        )}
      </Card>
    </FormRadioGroup>
  );
}
