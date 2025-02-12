class Triangle {
    constructor() {
        this.type = 'triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.buffer = null;
    }

    render() {
        var xy = this.position;
        var rgba = this.color;

        // Pass the position of a point to a_Position variable
        gl.vertexAttrib3f(a_Position, xy[0], xy[1], 0.0);
        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // Draw
        // gl.drawArrays(gl.POINTS, 0, 1);
        var d = 50.0;
        drawTriangle( [xy[0]-(d/2), xy[1]-(d/2), xy[0]+(d/2), xy[1]-(d/2), xy[0], xy[1]+(d/2)] );
    }
}

function drawTriangle(vertices) {
    // var vertices = new Float32Array([0,0.5,   -0.5,-0.5,    0.5,-0.5])
    var n = 3; // number of vertices

    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // assign the buffer object to the a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    // enable the assignment to the a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    // return n;
}

function drawTriangle3D(vertices) {
    // var vertices = new Float32Array([0,0.5,   -0.5,-0.5,    0.5,-0.5])
    var n = 3; // number of vertices

    var vertexBuffer = gl.createBuffer();
    if (this.buffer === null) {
        // create a buffer object
        this.buffer = gl.creaetBuffer();
        if (!this.buffer) {
            console.log("Failed to create the buffer object");
            return -1
        }
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);

    // assign the buffer object to the a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // enable the assignment to the a_Position variable
    gl.enableVertexAttribArray(a_Position);

    gl.drawArrays(gl.TRIANGLES, 0, n);
    // return n;
}

function drawTriangle2D(v) {
    drawTriangle3D( [v[0],v[1],0,    v[2],v[3],0,    v[4],v[5],0] );
}