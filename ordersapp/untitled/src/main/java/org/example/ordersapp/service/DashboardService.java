package org.example.ordersapp.service;

import org.example.ordersapp.entity.Dashboard;
import org.example.ordersapp.repository.DashboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private DashboardRepository dashboardRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public Dashboard saveDashboard(Map<String, Object> payload) throws Exception {
        String layoutJson = objectMapper.writeValueAsString(payload.get("layout"));
        Dashboard dashboard = new Dashboard();
        dashboard.setLayout(layoutJson);
        return dashboardRepository.save(dashboard);
    }

    public Dashboard getLatestDashboard() {
        return dashboardRepository.findAll(Sort.by(Sort.Direction.DESC, "id"))
                .stream()
                .findFirst()
                .orElse(null);
    }
}