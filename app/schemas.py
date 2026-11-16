from pydantic import BaseModel, Field

class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
