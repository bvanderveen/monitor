(schema schema 0.0.1
    (record sensor_state (fields
        (field position coordinate)
        (field orientation quaternion)))
    (record quaternion (fields
        (field w f32)
        (field x f32)
        (field y f32)
        (field z f32)))
    (record coordinate (fields 
        (field latitude f32)
        (field longitude f32)
        (field altitude f32))))

