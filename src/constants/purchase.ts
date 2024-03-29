// -1: Sản phẩm đang trong giỏ hàng
// 0: Tất cả sản phâm
// 1: Sản phẩm đang đợi xác nhận từ chủ shop
// 2: Sản phẩm đang được lấy hàng
// 3: Sản phẩm đang vận chuyển
// 4: San phẩm đã được giao
// 5: Sản phẩm đã bị hủy

export const purchasesStatus = {
  inCart: -1,
  all: 0,
  waitForConfirmation: 1,
  waitForGetting: 2,
  inProgress: 3,
  delivered: 4,
  cancelled: 5
} as const
