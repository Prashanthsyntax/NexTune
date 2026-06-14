package com.nextune.backend.repository;

import com.nextune.backend.model.Album;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlbumRepository extends JpaRepository<Album, Long> {
    List<Album> findByArtistId(Long artistId);
    List<Album> findByTitleContainingIgnoreCase(String title);
}