package com.nextune.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SongResponse {
    private Long id;
    private String title;
    private String artistName;
    private Long artistId;
    private String albumTitle;
    private Long albumId;
    private String genre;
    private String audioUrl;
    private String coverImage;
    private Integer duration;
    private Long playCount;
    private Long likeCount;
    private boolean premium;
    private String status;
    private LocalDateTime createdAt;
}