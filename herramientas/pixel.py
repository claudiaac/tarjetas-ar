"""Genera disenos/pixel.svg: pastel de cumpleaños en pixel art (cuadrícula de 40x40)."""
from pathlib import Path

N, C = 40, 25  # celdas por lado, tamaño de cada celda en px
celdas = {}

def px(x, y, color):
    if 0 <= x < N and 0 <= y < N:
        celdas[(x, y)] = color

def rect(x0, y0, w, h, color):
    for x in range(x0, x0 + w):
        for y in range(y0, y0 + h):
            px(x, y, color)

FUENTE = {  # 3x5
    'H': ['101', '101', '111', '101', '101'], 'A': ['010', '101', '111', '101', '101'],
    'P': ['110', '101', '110', '100', '100'], 'Y': ['101', '101', '010', '010', '010'],
    'B': ['110', '101', '110', '101', '110'], 'D': ['110', '101', '101', '101', '110'],
    '-': ['000', '000', '111', '000', '000'], '!': ['010', '010', '010', '000', '010'],
}

def texto(t, x0, y0, color, sombra=None):
    x = x0
    for ch in t:
        for fy, fila in enumerate(FUENTE[ch]):
            for fx, bit in enumerate(fila):
                if bit == '1':
                    if sombra:
                        px(x + fx + 1, y0 + fy + 1, sombra)
                    px(x + fx, y0 + fy, color)
        x += 4

def sprite(dibujo, x0, y0, paleta):
    for dy, fila in enumerate(dibujo):
        for dx, ch in enumerate(fila):
            if ch in paleta:
                px(x0 + dx, y0 + dy, paleta[ch])

CORAZON = ['.11.11.', '1221111', '1211111', '1111111', '.11111.', '..111..', '...1...']
MONEDA = ['.111.', '12221', '12121', '12221', '.111.']
ESTRELLA = ['..1..', '..1..', '11111', '.111.', '1...1']
HONGO = ['..111..', '.12121.', '1111111', '..333..', '..333..']

# fondo: cielo nocturno
rect(0, 0, N, N, '#1B1F3B')
for (x, y) in [(2, 2), (9, 1), (16, 3), (25, 1), (33, 2), (38, 6), (1, 12), (37, 14), (3, 22), (36, 25),
               (1, 33), (38, 35), (12, 16), (28, 17), (6, 38), (31, 38), (20, 15)]:
    px(x, y, '#FFFFFF')
for (x, y) in [(6, 13), (35, 13), (14, 37), (24, 38), (2, 28), (37, 30)]:
    px(x, y, '#7FD4F5')

# texto
texto('HAPPY', 10, 2, '#FFD166')
texto('B-DAY!', 8, 8, '#7FD4F5')

# piso
rect(0, 36, N, 4, '#3B2F6B')
rect(0, 36, N, 1, '#5A4A9A')

# pastel
rect(9, 27, 22, 9, '#F7C6D0')      # capa de abajo
rect(9, 27, 22, 2, '#FF7FA3')      # betún
for x in range(9, 31, 3):
    px(x, 29, '#FF7FA3')
rect(9, 31, 22, 1, '#FFFFFF')
rect(12, 20, 16, 7, '#FFE8A3')     # capa de arriba
rect(12, 20, 16, 2, '#FFFFFF')     # crema
for x in range(12, 28, 3):
    px(x, 22, '#FFFFFF')
rect(10, 35, 20, 1, '#C9728A')     # sombra
# chispas
for (x, y, c) in [(11, 33, '#7FD4F5'), (15, 30, '#FFD166'), (19, 33, '#8EDB9C'), (24, 30, '#7FD4F5'),
                  (28, 33, '#FFD166'), (14, 24, '#FF7FA3'), (19, 25, '#7FD4F5'), (24, 24, '#8EDB9C')]:
    px(x, y, c)
# velas
for x, c in [(15, '#7FD4F5'), (19, '#FF7FA3'), (23, '#8EDB9C')]:
    rect(x, 16, 2, 4, c)
    px(x, 17, '#FFFFFF')
    px(x, 14, '#FFD166'); px(x + 1, 14, '#FFD166')
    px(x, 13, '#FFB347'); px(x + 1, 15, '#FFB347'); px(x, 15, '#FFB347')

# sprites alrededor
sprite(CORAZON, 1, 17, {'1': '#E0474C', '2': '#FFFFFF'})
sprite(CORAZON, 32, 19, {'1': '#E0474C', '2': '#FFFFFF'})
sprite(MONEDA, 3, 25, {'1': '#E5AE3A', '2': '#FFD166'})
sprite(MONEDA, 33, 26, {'1': '#E5AE3A', '2': '#FFD166'})
sprite(ESTRELLA, 33, 7, {'1': '#FFD166'})
sprite(ESTRELLA, 2, 7, {'1': '#B69CFF'})
sprite(HONGO, 1, 31, {'1': '#E0474C', '2': '#FFFFFF', '3': '#F7EBD3'})
sprite(HONGO, 32, 31, {'1': '#8EDB9C', '2': '#FFFFFF', '3': '#F7EBD3'})

partes = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {N*C} {N*C}" width="{N*C}" height="{N*C}" shape-rendering="crispEdges">']
for (x, y), color in sorted(celdas.items()):
    partes.append(f'<rect x="{x*C}" y="{y*C}" width="{C}" height="{C}" fill="{color}"/>')
partes.append('</svg>')
salida = Path(__file__).resolve().parent.parent / 'disenos' / 'pixel.svg'
salida.write_text('\n'.join(partes), encoding='utf-8')
print(salida)
