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
        (field lat f32)
        (field lon f32)
        (field alt f32)
        (field t time_t)))

    (record gps_velocity_t (fields 
        (field course f32)
        (field speed f32)))

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

    (record effector_state_t (fields
        (field throttle f32)
        (field aileron f32)
        (field elevator f32)
        (field rudder f32)))

    (record control_state_t (fields
        (field rudder_pid_state pid_state_t)))

    (combination vehicle_state_t (fields
        (field sensor_state sensor_state_t)))

    (combination controllable_vehicle_state (fields
        (field control_state control_state_t)
        (field effector_state effector_state_t)
        ))

    (combination vehicle_config_t (fields
        (field rudder_pid_config pid_config_t)))
    )

