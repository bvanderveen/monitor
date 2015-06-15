/*
 * Copyright (c) 2014 Joris Vink <joris@coders.se>
 *
 * Permission to use, copy, modify, and distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

#include <kore/kore.h>
#include <kore/http.h>
#include <math.h>

#include "schema.h"
#include "assets.h"

#define DEGREES_TO_RADIANS(D) ((D) / 180.0 * M_PI)

int     page(struct http_request *);
int     page_ws_connect(struct http_request *);

void        websocket_connect(struct connection *);
void        websocket_disconnect(struct connection *);
void        websocket_message(struct connection *,
            u_int8_t, void *, size_t);

/* Websocket callbacks. */
struct kore_wscbs wscbs = {
    websocket_connect,
    websocket_message,
    websocket_disconnect
};


void euler_to_quaternion(double heading, double attitude, double bank, double *w, double *x, double *y, double *z);
void euler_to_quaternion(double heading, double attitude, double bank, double *w, double *x, double *y, double *z) {
    double c1 = cos(heading);
    double s1 = sin(heading);
    double c2 = cos(attitude);
    double s2 = sin(attitude);
    double c3 = cos(bank);
    double s3 = sin(bank);
    double _w = sqrt(1.0 + c1 * c2 + c1*c3 - s1 * s2 * s3 + c2*c3) / 2.0;
    double w4 = (4.0 * _w);
    *w = _w;
    *x = (c2 * s3 + c1 * s3 + s1 * s2 * c3) / w4;
    *y = (s1 * c2 + s1 * c3 + c1 * s2 * s3) / w4;
    *z = (-s1 * s3 + c1 * s2 * c3 +s2) / w4;
}


/* Called whenever we get a new websocket connection. */
void
websocket_connect(struct connection *c)
{
    kore_log(LOG_NOTICE, "%p: connected!", c);

    struct caut_encode_iter encode_iter;

    size_t buffer_size = MESSAGE_MAX_SIZE_schema;

    char *buffer[buffer_size];

    caut_encode_iter_init(&encode_iter, buffer, buffer_size);


    struct val_3_t val_3_t_zero;
    val_3_t_zero.x = 0;
    val_3_t_zero.y = 0;
    val_3_t_zero.z = 0;
    val_3_t_zero.t = 0;

    struct message_schema m;

    m._type = type_index_schema_sensor_state_t;

    double w, x, y, z;

    euler_to_quaternion(0, DEGREES_TO_RADIANS(10), DEGREES_TO_RADIANS(30), &w, &x, &y, &z);

    struct sensor_state_t sensor_state;

    sensor_state.mag_reading = val_3_t_zero;
    sensor_state.acc_reading = val_3_t_zero;
    sensor_state.gyr_reading = val_3_t_zero;
    sensor_state.quat_reading.w = w;
    sensor_state.quat_reading.x = x;
    sensor_state.quat_reading.y = y;
    sensor_state.quat_reading.z = z;
    sensor_state.quat_reading.t = 0.0;
    sensor_state.gps_position.lat = 0;
    sensor_state.gps_position.lon = 0;
    sensor_state.gps_position.alt = 0;
    sensor_state.gps_position.t = 0;
    sensor_state.gps_velocity.course = 0;
    sensor_state.gps_velocity.speed = 0;

    m._data.msg_sensor_state_t = sensor_state;

    encode_message_schema(&encode_iter, &m);


    kore_log(LOG_NOTICE, "wrote quat (%f, %f, %f, %f)", w, x, y, z);
    kore_websocket_send(c, WEBSOCKET_OP_BINARY, &buffer, encode_iter.position);
}


void
websocket_message(struct connection *c, u_int8_t op, void *data, size_t len)
{
    kore_log(LOG_NOTICE, "data: %s", data);
}

void
websocket_disconnect(struct connection *c)
{
    kore_log(LOG_NOTICE, "%p: disconnecting", c);
}

int
page(struct http_request *req)
{
    http_response_header(req, "content-type", "text/html");
    http_response(req, 200, asset_frontend_html, asset_len_frontend_html);

    return (KORE_RESULT_OK);
}

int
page_ws_connect(struct http_request *req)
{
    kore_log(LOG_NOTICE, "got ws connect");
    /* Perform the websocket handshake, passing our callbacks. */
    kore_websocket_handshake(req, &wscbs);

    return (KORE_RESULT_OK);
}