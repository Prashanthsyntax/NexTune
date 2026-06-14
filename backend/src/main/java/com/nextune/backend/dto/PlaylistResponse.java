package com.nextune.backend.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlaylistResponse {
    private Long id;
    private String name;
    private String description;
    private String coverImage;
    private boolean isPublic;
    private Long userId;
    private String username;
    private int songCount;
    private List<SongResponse> songs;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}