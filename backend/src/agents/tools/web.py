import aiohttp
from typing import Optional
from bs4 import BeautifulSoup


async def fetch_url(session: aiohttp.ClientSession, url: str) -> Optional[str]:
    """Fetches a URL and returns cleaned text content."""
    try:
        async with session.get(url, timeout=15) as response:
            if response.status != 200:
                print(f"      ! Failed to fetch {url}: Status {response.status}")
                return None
            html = await response.text()
            soup = BeautifulSoup(html, "html.parser")

            # Remove scripts, styles, nav, and footers
            for element in soup(["script", "style", "nav", "footer", "header"]):
                element.decompose()

            # Extract text
            text = soup.get_text(separator=" ", strip=True)
            return text[:6000]  # Limit per source
    except Exception as e:
        print(f"      ! Error fetching {url}: {e}")
        return None
