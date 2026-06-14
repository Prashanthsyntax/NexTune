package com.nextune.backend.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlbumResponse {
    private Long id;
    private String title;
    private String artistName;
    private Long artistId;
    private String coverImage;
    private LocalDate releaseDate;
    private String description;
    private String albumType;
    private LocalDateTime createdAt;
    private List<SongResponse> songs;
}