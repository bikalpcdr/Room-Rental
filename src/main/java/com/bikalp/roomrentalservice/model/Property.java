package com.bikalp.roomrentalservice.model;

import com.bikalp.roomrentalservice.model.base.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name = "property")
public class Property extends BaseEntity {

}
