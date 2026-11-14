
package com.netscope.backend.repository;

import com.netscope.backend.model.NetworkFlow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NetworkFlowRepository
        extends JpaRepository<NetworkFlow, Long> {

    List<NetworkFlow> findByCaptureId(Long captureId);
}
