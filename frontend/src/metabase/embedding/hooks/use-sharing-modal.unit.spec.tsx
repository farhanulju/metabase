import { act, renderHook } from "@testing-library/react";
import { replace } from "react-router-redux";

import type { DashboardSharingModalType } from "metabase/embedding/components/SharingMenu/types";

import { useSharingModal } from "./use-sharing-modal";

const mockDispatch = jest.fn();

jest.mock("metabase/lib/redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("react-router-redux", () => ({
  replace: jest.fn((location) => ({ type: "REPLACE", payload: location })),
}));

const mockLocation = {
  pathname: "/dashboard/1",
  search: "",
  hash: "",
  state: undefined,
  key: "test",
};

jest.mock("react-use", () => ({
  useLocation: () => mockLocation,
}));

describe("useSharingModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.hash = "";
  });

  describe("dashboard resource type", () => {
    it("should initialize with null values when no hash parameters are present", () => {
      const { result } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.modalType).toBeNull();
      expect(result.current.initialEmbedType).toBeUndefined();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("should extract dashboard-embed modal type from hash and remove it from URL", () => {
      mockLocation.hash = "#modal=dashboard-embed";

      const { result } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.modalType).toBe("dashboard-embed");
      expect(mockDispatch).toHaveBeenCalledWith(
        replace({
          ...mockLocation,
          hash: "",
        }),
      );
    });

    it("should extract both modal and embedType from hash and remove them from URL", () => {
      mockLocation.hash = "#modal=dashboard-embed&embedType=legalese";

      const { result } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.modalType).toBe("dashboard-embed");
      expect(result.current.initialEmbedType).toBe("legalese");
      expect(mockDispatch).toHaveBeenCalledWith(
        replace({
          ...mockLocation,
          hash: "",
        }),
      );
    });

    it("should preserve other hash parameters when removing modal and embedType", () => {
      mockLocation.hash =
        "#modal=dashboard-embed&embedType=application&foo=bar";

      renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(mockDispatch).toHaveBeenCalledWith(
        replace({
          ...mockLocation,
          hash: "foo=bar",
        }),
      );
    });

    it("should ignore invalid modal types for dashboard", () => {
      mockLocation.hash = "#modal=question-embed";

      const { result } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.modalType).toBeNull();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("should ignore unknown modal types", () => {
      mockLocation.hash = "#modal=unknown-modal";

      const { result } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.modalType).toBeNull();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe("question resource type", () => {
    it("should extract question-embed modal type from hash and remove it from URL", () => {
      mockLocation.hash = "#modal=question-embed";

      const { result } = renderHook(() =>
        useSharingModal({ resourceType: "question" }),
      );

      expect(result.current.modalType).toBe("question-embed");
      expect(mockDispatch).toHaveBeenCalledWith(
        replace({
          ...mockLocation,
          hash: "",
        }),
      );
    });

    it("should ignore invalid modal types for question", () => {
      mockLocation.hash = "#modal=dashboard-embed";

      const { result } = renderHook(() =>
        useSharingModal({ resourceType: "question" }),
      );

      expect(result.current.modalType).toBeNull();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe("hash updates", () => {
    it("should handle location updates when new hash values are set", () => {
      mockLocation.hash = "";

      const { result, rerender } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.modalType).toBeNull();
      expect(mockDispatch).not.toHaveBeenCalled();

      mockLocation.hash = "#modal=dashboard-embed&embedType=application";

      rerender();

      expect(result.current.modalType).toBe("dashboard-embed");
      expect(result.current.initialEmbedType).toBe("application");
      expect(mockDispatch).toHaveBeenCalledWith(
        replace({
          ...mockLocation,
          hash: "",
        }),
      );
    });

    it("should not dispatch if hash changes but has no relevant parameters", () => {
      mockLocation.hash = "";

      const { rerender } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(mockDispatch).not.toHaveBeenCalled();

      mockLocation.hash = "#someOtherParam=value";

      rerender();

      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("should handle multiple hash updates correctly", () => {
      mockLocation.hash = "#modal=dashboard-embed";

      const { result, rerender } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.modalType).toBe("dashboard-embed");
      expect(mockDispatch).toHaveBeenCalledTimes(1);

      jest.clearAllMocks();
      mockLocation.hash = "#modal=dashboard-embed&embedType=legalese";

      rerender();

      expect(result.current.modalType).toBe("dashboard-embed");
      expect(result.current.initialEmbedType).toBe("legalese");
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe("setModalType functionality", () => {
    it("should allow updating modal type via setModalType", () => {
      const { result } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.modalType).toBeNull();

      act(() => {
        result.current.setModalType("dashboard-embed");
      });

      expect(result.current.modalType).toBe("dashboard-embed");
    });
  });

  describe("edge cases", () => {
    it("should not process embedType if modal is not present", () => {
      mockLocation.hash = "#embedType=application";

      const { result } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.initialEmbedType).toBeUndefined();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("should handle modal without embedType", () => {
      mockLocation.hash = "#modal=dashboard-embed";

      const { result } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.modalType).toBe("dashboard-embed");
      expect(result.current.initialEmbedType).toBeUndefined();
      expect(mockDispatch).toHaveBeenCalledWith(
        replace({
          ...mockLocation,
          hash: "",
        }),
      );
    });

    it("should handle empty hash string", () => {
      mockLocation.hash = "";

      const { result } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.modalType).toBeNull();
      expect(result.current.initialEmbedType).toBeUndefined();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it("should handle hash with only # character", () => {
      mockLocation.hash = "#";

      const { result } = renderHook(() =>
        useSharingModal<DashboardSharingModalType>({
          resourceType: "dashboard",
        }),
      );

      expect(result.current.modalType).toBeNull();
      expect(result.current.initialEmbedType).toBeUndefined();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});
