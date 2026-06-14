package com.nextune.backend.repository;

import com.nextune.backend.model.Song;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SongRepository extends JpaRepository<Song, Long> {

    List<Song> findByArtistId(Long artistId);
    List<Song> findByAlbumId(Long albumId);
    List<Song> findByGenreId(Long genreId);

    @Query("SELECT s FROM Song s WHERE s.status = 'APPROVED' AND s.active = true " +
           "AND (LOWER(s.title) LIKE LOWER(CONCAT('%',:query,'%')) " +
           "OR LOWER(s.artist.artistName) LIKE LOWER(CONCAT('%',:query,'%')))")
    Page<Song> searchSongs(@Param("query") String query, Pageable pageable);

    @Query("SELECT s FROM Song s WHERE s.status = 'APPROVED' AND s.active = true " +
           "ORDER BY s.playCount DESC")
    List<Song> findTopSongs(Pageable pageable);

    @Query("SELECT s FROM Song s WHERE s.status = 'APPROVED' AND s.active = true " +
           "ORDER BY s.createdAt DESC")
    List<Song> findLatestSongs(Pageable pageable);

    List<Song> findByStatusAndActiveTrue(Song.SongStatus status);
}