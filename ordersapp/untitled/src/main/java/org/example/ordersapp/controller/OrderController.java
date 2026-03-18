//package org.example.ordersapp.controller;
//
//import org.example.ordersapp.entity.Order;
//import org.example.ordersapp.service.OrderService;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/orders")
//@CrossOrigin(origins = "http://localhost:5173") // React frontend URL
//public class OrderController {
//
//    private final OrderService orderService;
//
//    // Constructor injection (recommended)
//    public OrderController(OrderService orderService) {
//        this.orderService = orderService;
//    }
//
//    // GET all orders
//    @GetMapping
//    public List<Order> getAllOrders() {
//        return orderService.getAllOrders();
//    }
//
//    // POST to create or update an order
//    @PostMapping
//    public Order createOrUpdateOrder(@RequestBody Order order) {
//        return orderService.saveOrder(order);
//    }
//
//    // DELETE an order by ID
//    @DeleteMapping("/{id}")
//    public void deleteOrder(@PathVariable Long id) {
//        orderService.deleteOrder(id);
//
package org.example.ordersapp.controller;

import org.example.ordersapp.entity.Order;
import org.example.ordersapp.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }
    @PostMapping
    public Order createOrUpdateOrder(@RequestBody Order order) {
        return orderService.saveOrder(order);
    }
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }
}