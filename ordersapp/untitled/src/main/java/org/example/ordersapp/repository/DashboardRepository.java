package org.example.ordersapp.repository;

import org.example.ordersapp.entity.Dashboard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DashboardRepository extends JpaRepository<Dashboard, Long> {
}