package org.example.ordersapp.service;

import org.example.ordersapp.entity.Order;
import org.example.ordersapp.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order saveOrder(Order order) {
            order.setTotalAmount(order.getQty() * order.getUnitPrice());
        if (order.getStatus() == null) {
            order.setStatus("Pending");
        }
        if (order.getOrderDate() == null) {
            order.setOrderDate(java.time.LocalDate.now());
        }
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}