package com.nextune.backend.repository;

import com.nextune.backend.model.Artist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ArtistRepository extends JpaRepository<Artist, Long> {
    Optional<Artist> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    boolean existsByArtistName(String artistName);
}