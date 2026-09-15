from pathlib import Path
from shutil import copy2

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf"
PUBLIC = ROOT / "public" / "community" / "resources"
OUTPUT.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

INK = colors.HexColor("#17132B")
PANEL = colors.HexColor("#241D45")
ACCENT = colors.HexColor("#FCEE21")
MINT = colors.HexColor("#70D6AD")
CORAL = colors.HexColor("#FF8F8F")
WHITE = colors.HexColor("#FFFFFF")
MUTED = colors.HexColor("#C7C1D9")

font_candidates = [
    Path("C:/Windows/Fonts/arial.ttf"),
    Path("C:/Windows/Fonts/calibri.ttf"),
]
bold_candidates = [
    Path("C:/Windows/Fonts/arialbd.ttf"),
    Path("C:/Windows/Fonts/calibrib.ttf"),
]
body_font = "Helvetica"
bold_font = "Helvetica-Bold"
for candidate in font_candidates:
    if candidate.exists():
        pdfmetrics.registerFont(TTFont("WRBody", str(candidate)))
        body_font = "WRBody"
        break
for candidate in bold_candidates:
    if candidate.exists():
        pdfmetrics.registerFont(TTFont("WRBold", str(candidate)))
        bold_font = "WRBold"
        break


def header(canvas, doc, label):
    canvas.saveState()
    canvas.setFillColor(INK)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setFillColor(ACCENT)
    canvas.setFont(bold_font, 8)
    canvas.drawString(18 * mm, A4[1] - 14 * mm, "WELLNESSREAL · COMUNIDAD TIROIDES")
    canvas.setFillColor(MUTED)
    canvas.setFont(body_font, 7)
    canvas.drawRightString(A4[0] - 18 * mm, A4[1] - 14 * mm, label.upper())
    canvas.setStrokeColor(colors.HexColor("#433A68"))
    canvas.line(18 * mm, A4[1] - 18 * mm, A4[0] - 18 * mm, A4[1] - 18 * mm)
    canvas.setFillColor(MUTED)
    canvas.setFont(body_font, 7)
    canvas.drawString(18 * mm, 10 * mm, "Material educativo. No sustituye una valoración sanitaria ni un plan individual.")
    canvas.drawRightString(A4[0] - 18 * mm, 10 * mm, f"{doc.page}")
    canvas.restoreState()


styles = {
    "title": ParagraphStyle("title", fontName=bold_font, fontSize=25, leading=28, textColor=WHITE, spaceAfter=8),
    "lead": ParagraphStyle("lead", fontName=body_font, fontSize=10.5, leading=15, textColor=MUTED, spaceAfter=12),
    "h2": ParagraphStyle("h2", fontName=bold_font, fontSize=12, leading=15, textColor=ACCENT, spaceBefore=8, spaceAfter=6),
    "body": ParagraphStyle("body", fontName=body_font, fontSize=9, leading=13, textColor=WHITE),
    "small": ParagraphStyle("small", fontName=body_font, fontSize=8, leading=11, textColor=MUTED),
    "center": ParagraphStyle("center", fontName=bold_font, fontSize=10, leading=13, textColor=INK, alignment=TA_CENTER),
}


def box(rows, widths=None, header_row=False):
    table = Table(rows, colWidths=widths, hAlign="LEFT")
    commands = [
        ("BACKGROUND", (0, 0), (-1, -1), PANEL),
        ("TEXTCOLOR", (0, 0), (-1, -1), WHITE),
        ("FONTNAME", (0, 0), (-1, -1), body_font),
        ("FONTSIZE", (0, 0), (-1, -1), 8.5),
        ("LEADING", (0, 0), (-1, -1), 11),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#514774")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 7),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]
    if header_row:
        commands += [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#332959")),
            ("TEXTCOLOR", (0, 0), (-1, 0), ACCENT),
            ("FONTNAME", (0, 0), (-1, 0), bold_font),
        ]
    table.setStyle(TableStyle(commands))
    return table


def make_pdf(filename, label, title, lead, story):
    path = OUTPUT / filename
    doc = SimpleDocTemplate(
        str(path), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
        topMargin=25 * mm, bottomMargin=17 * mm, title=title, author="WellnessReal"
    )
    doc.build(story, onFirstPage=lambda c, d: header(c, d, label), onLaterPages=lambda c, d: header(c, d, label))
    copy2(path, PUBLIC / filename)


def p(text, style="body"):
    return Paragraph(text, styles[style])


def cells(rows):
    return [[value if isinstance(value, Paragraph) else p(str(value), "small") for value in row] for row in rows]


make_pdf(
    "planificador-semanal-tiroides.pdf", "Planificador semanal", "Tu semana antes de que empiece",
    "Un plan útil no es el que ocupa más. Es el que cabe en una semana real, incluso cuando se complica.",
    [p("Tu semana antes de que empiece", "title"), p("Un plan útil no es el que ocupa más. Es el que cabe en una semana real, incluso cuando se complica.", "lead"),
     p("1. Mis dos huecos protegidos", "h2"), box([["Sesión 1", "Día: __________", "Hora: __________"], ["Sesión 2", "Día: __________", "Hora: __________"]], [32*mm, 64*mm, 64*mm]),
     p("2. Mi versión mínima", "h2"), p("Si una sesión se complica, haré durante 20 minutos: ____________________________________________"), Spacer(1, 6*mm),
     p("3. Mis comidas ancla", "h2"), box([["Momento", "Opción sencilla que puedo repetir"], ["Primera comida", ""], ["Comida principal", ""], ["Cena", ""]], [45*mm, 115*mm], True),
     p("4. Anticipa el obstáculo", "h2"), p("Si ocurre ______________________________________, entonces haré ______________________________________."),
     p("Cierre de semana", "h2"), box([["¿Qué salió bien?", ""], ["¿Qué necesito ajustar?", ""], ["Mi siguiente paso", ""]], [52*mm, 108*mm])]
)

make_pdf(
    "semaforo-energia-tiroides.pdf", "Semáforo de energía", "Entrenar sin improvisar",
    "El semáforo no diagnostica. Te ayuda a escoger una versión prudente de la sesión y observar cómo respondes.",
    [p("Entrenar sin improvisar", "title"), p("El semáforo no diagnostica. Te ayuda a escoger una versión prudente de la sesión y observar cómo respondes.", "lead"),
     box(cells([[p("VERDE", "center"), p("AMARILLO", "center"), p("ROJO", "center")],
          ["Energía parecida a la habitual.", "Más cansancio, pero puedes moverte con normalidad.", "Síntomas nuevos, mareo, dolor preocupante o agotamiento inusual."],
          ["Haz la sesión prevista sin buscar agotarte.", "Calienta 5-10 min. Reduce una serie, la carga o la duración.", "No fuerces. Descansa y valora atención sanitaria si corresponde."]]), [53*mm, 53*mm, 53*mm]),
     p("Comprobación de hoy", "h2"), box([["Energía antes (1-5)", "____"], ["¿Me encuentro mejor tras calentar?", "Sí / No"], ["Versión elegida", "Verde / Amarilla / Roja"], ["Energía después (1-5)", "____"]], [85*mm, 75*mm]),
     p("Tu versión amarilla", "h2"), p("Ejercicios que mantengo: __________________________________________________________________"), Spacer(1, 4*mm), p("Qué reduzco: ______________________________________________________________________________"),
     p("Señales para parar y consultar", "h2"), p("Dolor preocupante, mareo, dificultad respiratoria fuera de lo habitual, desmayo o síntomas nuevos importantes. Ante una urgencia, busca atención sanitaria.", "small")]
)

make_pdf(
    "registro-semanal-tiroides.pdf", "Registro semanal", "Datos sencillos para ajustar",
    "No necesitas registrar todo. Necesitas suficiente información para decidir qué mantener y qué cambiar.",
    [p("Datos sencillos para ajustar", "title"), p("No necesitas registrar todo. Necesitas suficiente información para decidir qué mantener y qué cambiar.", "lead"),
     box([["Indicador", "L", "M", "X", "J", "V", "S", "D"], ["Energía 1-5", "", "", "", "", "", "", ""], ["Sueño 1-5", "", "", "", "", "", "", ""], ["Movimiento", "", "", "", "", "", "", ""]], [45*mm]+[16.4*mm]*7, True),
     p("Entrenamiento", "h2"), box([["Sesiones previstas", "____"], ["Sesiones realizadas", "____"], ["Ejercicio que mejor ha ido", ""], ["Ejercicio que necesita ajuste", ""], ["Molestias nuevas", ""]], [55*mm, 105*mm]),
     p("Lo importante de la semana", "h2"), box([["Principal victoria", ""], ["Principal obstáculo", ""], ["Qué mantendré", ""], ["Qué cambiaré", ""]], [55*mm, 105*mm]),
     p("Pregunta para Fernando o para el foro", "h2"), p("__________________________________________________________________________________________\n<br/>__________________________________________________________________________________________")]
)

make_pdf(
    "primera-rutina-fuerza-tiroides.pdf", "Primera rutina", "Dos sesiones para empezar",
    "Ejemplo educativo para aprender una estructura básica. La técnica, las cargas y las variantes deben adaptarse a tu situación.",
    [p("Dos sesiones para empezar", "title"), p("Ejemplo educativo para aprender una estructura básica. La técnica, las cargas y las variantes deben adaptarse a tu situación.", "lead"),
     p("Antes de empezar", "h2"), p("Calienta 5-8 minutos con movimientos cómodos. En cada serie termina sintiendo que podrías hacer 2 o 3 repeticiones más. Descansa lo necesario para repetir con buena técnica."),
     p("Sesión A", "h2"), box([["Ejercicio", "Series", "Repeticiones", "Carga / nota"], ["Sentadilla a silla", "2", "8-12", ""], ["Remo con banda o mancuerna", "2", "8-12", ""], ["Empuje inclinado en pared o mesa", "2", "8-12", ""], ["Puente de glúteo", "2", "8-12", ""]], [66*mm, 22*mm, 32*mm, 40*mm], True),
     p("Sesión B", "h2"), box([["Ejercicio", "Series", "Repeticiones", "Carga / nota"], ["Zancada asistida o sentadilla", "2", "8-12", ""], ["Remo con banda o mancuerna", "2", "8-12", ""], ["Press con banda o mancuernas", "2", "8-12", ""], ["Bisagra de cadera", "2", "8-12", ""]], [66*mm, 22*mm, 32*mm, 40*mm], True),
     p("Cómo progresar", "h2"), p("Cuando completes 12 repeticiones con buena técnica y margen durante dos sesiones, aumenta ligeramente la carga y vuelve a 8. Cambia una sola variable cada vez."),
     p("Para y revisa", "h2"), p("No entrenes contra dolor preocupante, mareo o síntomas nuevos. Si tienes una lesión, limitación relevante o el tratamiento no está ajustado, consulta con el profesional correspondiente antes de aumentar la carga.", "small")]
)

print("Created 4 community PDFs in output/pdf and public/community/resources")
