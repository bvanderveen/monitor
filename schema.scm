(schema schema 0.0.1
    (synonym time_t f32)

    (record pid_state_t (fields
        (field i_state f32)
        (field d_state f32)))

    (record pid_config_t (fields
        (field p_gain f32)
        (field i_gain f32)
        (field d_gain f32)))

    (record gps_position_t (fields 
        (field latitude f32)
        (field longitude f32)
        (field altitude f32)
        (field t time_t)))

    (record gps_velocity_t (fields 
        (field course f32)
        (field speed f32)
        (field altitude f32)))

    (record val_1_t (fields
        (field x f32)
        (field t time_t)))

    (record val_2_t (fields
        (field x f32)
        (field y f32)
        (field t time_t)))

    (record val_3_t (fields
        (field x f32)
        (field y f32)
        (field z f32)
        (field t time_t)))

    (record val_4_t (fields
        (field w f32)
        (field x f32)
        (field y f32)
        (field z f32)
        (field t time_t)))

    (record sensor_state_t (fields
        (field mag_reading val_3_t)
        (field acc_reading val_3_t)
        (field gyr_reading val_3_t)
        (field quat_reading val_4_t)
        (field gps_position gps_position_t)
        (field gps_velocity gps_velocity_t)))

    (record vehicle_t (fields
        (field sensor_state sensor_state_t)))

    )

