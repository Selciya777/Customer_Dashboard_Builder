package org.example.ordersapp.controller;

import org.example.ordersapp.entity.Dashboard;
import org.example.ordersapp.repository.DashboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.google.gson.Gson;
import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/dashboards")
public class DashboardController {

    @Autowired
    private DashboardRepository dashboardRepository;

    @PostMapping
    public ResponseEntity<Dashboard> saveDashboard(@RequestBody Map<String, Object> payload) {
        String layoutJson = new Gson().toJson(payload.get("layout"));
        Dashboard dashboard = new Dashboard();
        dashboard.setLayout(layoutJson);
        Dashboard saved = dashboardRepository.save(dashboard);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/latest")
    public Dashboard getLatestDashboard() {
        List<Dashboard> all = dashboardRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        return all.isEmpty() ? null : all.get(0);
    }
}