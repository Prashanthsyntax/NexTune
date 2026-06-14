package com.nextune.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GenreResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
}