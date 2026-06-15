package com.nextune.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArtistProfileResponse {
    private ArtistResponse artist;
    private String token;
}