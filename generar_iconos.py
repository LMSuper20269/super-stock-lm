from PIL import Image, ImageDraw, ImageFont

def crear_icono(tamano, ruta):
    img = Image.new('RGB', (tamano, tamano), '#75AADB')
    draw = ImageDraw.Draw(img)

    # Círculo blanco de fondo para el carrito
    margen = int(tamano * 0.12)
    draw.ellipse(
        [margen, margen, tamano - margen, tamano - margen],
        fill='#FFFFFF'
    )

    # Carrito simplificado (líneas celestes)
    color_carrito = '#75AADB'
    grosor = max(int(tamano * 0.045), 3)

    cx, cy = tamano // 2, tamano // 2
    ancho_carro = int(tamano * 0.32)
    alto_carro = int(tamano * 0.22)

    x0 = cx - ancho_carro // 2
    y0 = cy - alto_carro // 2

    # Cuerpo del carrito (forma de trapecio simple con líneas)
    draw.line([(x0 - grosor*2, y0), (x0, y0)], fill=color_carrito, width=grosor)
    draw.line([(x0, y0), (x0 + int(ancho_carro*0.15), y0 + alto_carro)], fill=color_carrito, width=grosor)
    draw.line([(x0 + int(ancho_carro*0.15), y0 + alto_carro), (x0 + ancho_carro, y0 + alto_carro)], fill=color_carrito, width=grosor)
    draw.line([(x0 + ancho_carro, y0 + alto_carro), (x0 + ancho_carro + int(ancho_carro*0.25), y0)], fill=color_carrito, width=grosor)

    # Ruedas
    r_rueda = max(int(tamano * 0.025), 3)
    draw.ellipse([
        x0 + int(ancho_carro*0.25) - r_rueda, y0 + alto_carro + r_rueda*2 - r_rueda,
        x0 + int(ancho_carro*0.25) + r_rueda, y0 + alto_carro + r_rueda*2 + r_rueda
    ], fill=color_carrito)
    draw.ellipse([
        x0 + int(ancho_carro*0.7) - r_rueda, y0 + alto_carro + r_rueda*2 - r_rueda,
        x0 + int(ancho_carro*0.7) + r_rueda, y0 + alto_carro + r_rueda*2 + r_rueda
    ], fill=color_carrito)

    img.save(ruta)
    print(f"Guardado: {ruta} ({tamano}x{tamano})")

crear_icono(192, '/home/claude/stock-app/public/icon-192.png')
crear_icono(512, '/home/claude/stock-app/public/icon-512.png')
