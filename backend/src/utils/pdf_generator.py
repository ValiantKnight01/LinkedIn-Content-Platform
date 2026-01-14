import os
from typing import List, Dict, Any
from jinja2 import Environment, FileSystemLoader
from playwright.async_api import async_playwright

TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), "pdf_templates")

class PDFGenerator:
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))
        self.template = self.env.get_template("carousel_template.html")

    def _map_post_to_slides(self, post_data: Dict[str, Any], author: str = "Aditya Kulkarni") -> List[Dict[str, Any]]:
        slides = []
        
        # 1. Title Slide
        slides.append({
            "type": "title",
            "type_class": "slide-title",
            "bg_class": "",
            "title": post_data.get("title", "Untitled Post"),
            "hook": post_data.get("hook", ""),
            "author": author
        })

        # 2. Content Slides
        bg_rotation = ["bg-cream", "bg-beige", "bg-sage"]
        sections = post_data.get("sections", [])
        for i, section in enumerate(sections):
            bg_class = bg_rotation[i % len(bg_rotation)]
            
            # Detect if it should be a quote slide
            # Heuristic: If content starts and ends with quotes and is relatively short
            content = section.get("content", "").strip()
            is_quote = (content.startswith('"') and content.endswith('"')) or (content.startswith('“') and content.endswith('”'))
            
            if is_quote:
                slides.append({
                    "type": "quote",
                    "type_class": "slide-quote",
                    "bg_class": "bg-dark",
                    "text": content.strip('"“”'),
                    "source": section.get("header", "Insight")
                })
            else:
                slides.append({
                    "type": "content",
                    "type_class": "slide-content",
                    "bg_class": bg_class,
                    "heading": section.get("header", ""),
                    "content": content,
                    "example": section.get("example_use_case", "")
                })

        # 3. Takeaways Slide
        takeaways = post_data.get("key_takeaways", [])
        if takeaways:
            slides.append({
                "type": "takeaways",
                "type_class": "slide-takeaways",
                "bg_class": "bg-dark",
                "items": takeaways,
                "cta": post_data.get("call_to_action", "")
            })

        return slides

    async def generate_pdf(self, post_data: Dict[str, Any], author: str = "Aditya Kulkarni") -> bytes:
        slides = self._map_post_to_slides(post_data, author)
        html_content = self.template.render(slides=slides)

        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            # Set viewport to match our slide size (1080x1080)
            await page.set_viewport_size({"width": 1080, "height": 1080})
            
            # Set content and wait for it to be rendered
            await page.set_content(html_content, wait_until="networkidle")
            
            # Generate PDF with exact dimensions
            pdf_bytes = await page.pdf(
                print_background=True,
                width="1080px",
                height="1080px",
                margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"},
                display_header_footer=False,
                prefer_css_page_size=True
            )
            
            await browser.close()
            return pdf_bytes
