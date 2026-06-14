package com.nextune.backend.repository;

import com.nextune.backend.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByUserIdAndArtistId(Long userId, Long artistId);
    List<Follow> findByUserId(Long userId);
    boolean existsByUserIdAndArtistId(Long userId, Long artistId);
}