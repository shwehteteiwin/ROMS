package com.romsproject.roms.entity;

// import jakarta.annotation.Generated;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name="roles")
public class Role {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer roleId;

    @Column(unique = true,nullable = false)
    private String roleName;

    //getters and setters
    public Integer getRoleId(){return roleId;}
    public void setRoleId(Integer roleId){this.roleId=roleId;}
    public String getRoleName(){return roleName;}
    public void setRoleName(String roleName){this.roleName=roleName;}

}
