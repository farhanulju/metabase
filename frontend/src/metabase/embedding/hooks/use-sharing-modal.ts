import { useEffect, useState } from "react";
import { replace } from "react-router-redux";
import { useLocation } from "react-use";

import type {
  DashboardSharingModalType,
  QuestionSharingModalType,
} from "metabase/embedding/components/SharingMenu/types";
import { parseHashOptions, stringifyHashOptions } from "metabase/lib/browser";
import { useDispatch } from "metabase/lib/redux";
import type {
  EmbedModalStep,
  StaticEmbedResourceType,
} from "metabase/public/lib/types";

const getInitialModalType = ({
  resourceType,
  modalTypeFromHash,
}: {
  resourceType: StaticEmbedResourceType;
  modalTypeFromHash?: string;
}) => {
  if (resourceType === "dashboard") {
    return modalTypeFromHash === "dashboard-embed" ? modalTypeFromHash : null;
  } else if (resourceType === "question") {
    return modalTypeFromHash === "question-embed" ? modalTypeFromHash : null;
  } else {
    return null;
  }
};

export const useSharingModal = <
  TModalType extends DashboardSharingModalType | QuestionSharingModalType,
>({
  resourceType,
}: {
  resourceType: StaticEmbedResourceType;
}) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const [modalType, setModalType] = useState<TModalType | null>(null);
  const [initialEmbedType, setInitialEmbedType] = useState<
    EmbedModalStep | undefined
  >(undefined);

  useEffect(() => {
    const options = parseHashOptions(location.hash ?? "");

    const modalTypeFromHash = getInitialModalType({
      resourceType,
      modalTypeFromHash: options.modal?.toString(),
    }) as TModalType;
    const embedTypeFromHash = options.embedType as EmbedModalStep | undefined;

    if (modalTypeFromHash) {
      setModalType(modalTypeFromHash);

      if (embedTypeFromHash) {
        setInitialEmbedType(embedTypeFromHash);
      }

      const adjustedOptions = { ...options };
      delete adjustedOptions.modal;
      delete adjustedOptions.embedType;

      const adjustedHash = stringifyHashOptions(adjustedOptions);

      dispatch(replace({ ...location, hash: adjustedHash }));
    }
  }, [location.hash, resourceType, dispatch, location]);

  return { modalType, setModalType, initialEmbedType };
};
