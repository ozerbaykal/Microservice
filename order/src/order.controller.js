const { validateDto, orderSchema } = require("./order.dto");
const orderService = require("./order.service");

class OrderController {
  async createOrder(req, res, next) {
    try {
      const orderData = await validateDto(req.body, orderSchema);
      const order = await OrderService.createOrder(req.user.userId, orderData);

      return res.status(201).json({ order: order });
    } catch (error) {
      next(error);
    }
  }
  async getOrder(req, res, next) {
    try {
      const { orderId } = req.params;
      const order = await orderService.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({ error: "sipariş bulunamadı" });
      }
      res.status(200).json({ order });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req, res, next) {}
  async getUserOrders(req, res, next) {}
}

module.exports = new OrderController();
