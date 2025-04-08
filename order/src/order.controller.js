const { validateDto, orderSchema } = require("./order.dto");
const OrderService = require("./order.service");

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
  async getOrder(req, res, next) {}
  async updateOrderStatus(req, res, next) {}
  async getUserOrders(req, res, next) {}
}

module.exports = new OrderController();
