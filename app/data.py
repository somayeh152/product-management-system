from app.schemas import ProductResponse


PRODUCTS: dict[int, ProductResponse] = {
    1: ProductResponse(
        id=1,
        name="Notebook",
        description="A4 lined notebook with 120 pages for daily notes.",
        price=4.5,
    ),
    2: ProductResponse(
        id=2,
        name="Mechanical Pencil",
        description="0.5 mm mechanical pencil with a soft grip.",
        price=3.2,
    ),
    3: ProductResponse(
        id=3,
        name="Desk Lamp",
        description="Adjustable LED desk lamp with three brightness levels.",
        price=29.9,
    ),
    4: ProductResponse(
        id=4,
        name="USB-C Hub",
        description="Compact hub with HDMI, USB-A, and SD card slots.",
        price=39.0,
    ),
    5: ProductResponse(
        id=5,
        name="Water Bottle",
        description="Stainless steel bottle that keeps drinks cold for 12 hours.",
        price=18.75,
    ),
}