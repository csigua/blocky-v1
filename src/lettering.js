class V1_Brand {
    constructor() {
      this.type = 'circle';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.segments = 10;

      this.matrix = new Matrix4();
      
    }
  
    render() {
        var rgba = this.color;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        // pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
        // Draw V
        drawTriangle2D([0,0.5,    0.25,0,   0.125,0.5]);
        drawTriangle2D([0.125,0.5,    0.25,0,   0.25,0.25]);
        drawTriangle2D([0.375,0.5,    0.25,0,   0.25,0.25]);
        drawTriangle2D([0.5,0.5,    0.25,0,   0.375,0.5]);

        // Draw 1
        drawTriangle2D([0.6,0,    0.7,0.5,  0.7,0]);
        drawTriangle2D([0.6,0,    0.7,0.5,  0.6,0.4]);
        drawTriangle2D([0.5,0,    0.8,0,  0.8,0.1]);
        drawTriangle2D([0.5,0,    0.5,0.1,  0.8,0.1]);
        drawTriangle2D([0.5,0.3,    0.6,0.3,  0.6,0.4]);
    }
}