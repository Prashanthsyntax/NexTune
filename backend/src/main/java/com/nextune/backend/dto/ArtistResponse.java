package com.nextune.backend.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArtistResponse {
    private Long id;
    private Long userId;
    private String artistName;
    private String bio;
    private String profileImage;
    private String coverImage;
    private Long followers;
    private boolean verified;
    private LocalDateTime createdAt;
}