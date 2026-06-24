"""
PhishGuard Pro — PDF Security Report Generator
Uses ReportLab to create professional phishing analysis reports.
"""
import io
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import logging

logger = logging.getLogger(__name__)

# Color scheme
NAVY = colors.HexColor("#0a192f")
CYAN = colors.HexColor("#00d4ff")
DARK_BG = colors.HexColor("#112240")
WHITE = colors.white
SAFE_GREEN = colors.HexColor("#00e676")
WARNING_YELLOW = colors.HexColor("#ffab00")
DANGER_RED = colors.HexColor("#ff1744")


def generate_report(scan_data):
    """
    Generate a PDF security report for a scan.
    Returns a BytesIO buffer containing the PDF.
    """
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=30 * mm,
        bottomMargin=20 * mm,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontSize=24,
        textColor=NAVY,
        spaceAfter=6,
        alignment=TA_CENTER,
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.grey,
        alignment=TA_CENTER,
        spaceAfter=20,
    )

    heading_style = ParagraphStyle(
        "SectionHeading",
        parent=styles["Heading2"],
        fontSize=14,
        textColor=NAVY,
        spaceBefore=16,
        spaceAfter=8,
    )

    body_style = ParagraphStyle(
        "BodyText",
        parent=styles["Normal"],
        fontSize=10,
        textColor=colors.HexColor("#333333"),
        spaceAfter=6,
    )

    elements = []

    # ── Header ─────────────────────────────────────────
    elements.append(Paragraph("🛡️ PhishGuard Pro", title_style))
    elements.append(Paragraph("Security Analysis Report", subtitle_style))
    elements.append(HRFlowable(
        width="100%", thickness=2, color=CYAN, spaceBefore=0, spaceAfter=16
    ))

    # ── Report Metadata ────────────────────────────────
    report_date = datetime.utcnow().strftime("%B %d, %Y at %H:%M UTC")
    elements.append(Paragraph(f"Generated: {report_date}", body_style))
    elements.append(Spacer(1, 12))

    # ── Scan Summary Table ─────────────────────────────
    elements.append(Paragraph("Scan Summary", heading_style))

    category = scan_data.get("category", "Unknown")
    risk_score = scan_data.get("risk_score", 0)
    confidence = scan_data.get("confidence", 0)

    # Category color
    if category == "Safe":
        cat_color = SAFE_GREEN
    elif category == "Suspicious":
        cat_color = WARNING_YELLOW
    else:
        cat_color = DANGER_RED

    summary_data = [
        ["Field", "Value"],
        ["URL Scanned", Paragraph(f'<font size="9">{scan_data.get("url", "N/A")}</font>', body_style)],
        ["Scan Date", scan_data.get("scanned_at", report_date)],
        ["Risk Score", f"{risk_score} / 100"],
        ["Classification", category],
        ["Confidence", f"{confidence}%"],
    ]

    summary_table = Table(summary_data, colWidths=[120, 350])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 11),
        ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f8f9fa")),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 10),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
        ("ALIGN", (0, 0), (-1, -1), "LEFT"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ]))
    elements.append(summary_table)
    elements.append(Spacer(1, 16))

    # ── Risk Assessment ────────────────────────────────
    elements.append(Paragraph("Risk Assessment", heading_style))

    probs = scan_data.get("probabilities", {})
    risk_data = [
        ["Category", "Probability"],
        ["✅ Safe", f'{probs.get("safe", 0)}%'],
        ["⚠️ Suspicious", f'{probs.get("suspicious", 0)}%'],
        ["🚨 Phishing", f'{probs.get("phishing", 0)}%'],
    ]

    risk_table = Table(risk_data, colWidths=[200, 270])
    risk_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("BACKGROUND", (0, 1), (0, 1), colors.HexColor("#e8f5e9")),
        ("BACKGROUND", (0, 2), (0, 2), colors.HexColor("#fff3e0")),
        ("BACKGROUND", (0, 3), (0, 3), colors.HexColor("#ffebee")),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#dee2e6")),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
    ]))
    elements.append(risk_table)
    elements.append(Spacer(1, 16))

    # ── Threat Indicators ──────────────────────────────
    indicators = scan_data.get("indicators", [])
    if indicators:
        elements.append(Paragraph("Threat Indicators", heading_style))
        for indicator in indicators:
            icon = {"critical": "🔴", "warning": "🟡", "info": "🔵", "safe": "🟢"}.get(
                indicator.get("type", "info"), "🔵"
            )
            elements.append(Paragraph(
                f'{icon} {indicator.get("message", "")}', body_style
            ))
        elements.append(Spacer(1, 16))

    # ── Security Recommendations ───────────────────────
    elements.append(Paragraph("Security Recommendations", heading_style))

    recommendations = _get_recommendations(category, risk_score, indicators)
    for rec in recommendations:
        elements.append(Paragraph(f"• {rec}", body_style))

    elements.append(Spacer(1, 24))

    # ── Footer ─────────────────────────────────────────
    elements.append(HRFlowable(
        width="100%", thickness=1, color=colors.grey, spaceBefore=12, spaceAfter=8
    ))
    footer_style = ParagraphStyle(
        "Footer", parent=styles["Normal"],
        fontSize=8, textColor=colors.grey, alignment=TA_CENTER,
    )
    elements.append(Paragraph(
        "PhishGuard Pro — AI-Powered Cybersecurity | Architect: Devicyt © 2026",
        footer_style,
    ))
    elements.append(Paragraph(
        "This report is auto-generated. Always verify findings with additional security tools.",
        footer_style,
    ))

    # Build PDF
    doc.build(elements)
    buffer.seek(0)
    return buffer


def _get_recommendations(category, risk_score, indicators):
    """Generate security recommendations based on scan results."""
    recs = []

    if category == "Phishing":
        recs.extend([
            "DO NOT click this link or enter any personal information.",
            "Report this URL to your IT security team and relevant authorities.",
            "If you've already interacted with this URL, change your passwords immediately.",
            "Enable two-factor authentication on all your accounts.",
            "Run a full malware scan on your device.",
        ])
    elif category == "Suspicious":
        recs.extend([
            "Exercise caution — this URL shows signs of potential phishing.",
            "Verify the sender or source before clicking.",
            "Check the URL carefully for misspellings or unusual characters.",
            "Use a sandbox or virtual machine if you need to visit this URL.",
            "Consider reporting the URL to your security team for review.",
        ])
    else:
        recs.extend([
            "This URL appears safe based on our analysis.",
            "Continue to practice safe browsing habits.",
            "Keep your browser and security software up to date.",
            "Be cautious with any links received via unsolicited emails.",
        ])

    # Additional indicator-based recommendations
    indicator_types = [i.get("type") for i in indicators]
    if "critical" in indicator_types:
        recs.append("Critical indicators were detected — treat this URL with extreme caution.")

    return recs
