from pydantic import BaseModel, Field, EmailStr, ConfigDict
from decimal import Decimal
from typing import Optional

class ProductBase(BaseModel):
    name: str
    sku: str
    price: Decimal = Field(..., ge=0)
    quantity_in_stock: int = Field(..., ge=0)

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    price: Optional[Decimal] = Field(None, ge=0)
    quantity_in_stock: Optional[int] = Field(None, ge=0)

class ProductResponse(ProductBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class CustomerBase(BaseModel):
    full_name: str
    email: EmailStr
    phone_number: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None

class CustomerResponse(CustomerBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class OrderBase(BaseModel):
    customer_id: int
    product_id: int
    quantity_ordered: int = Field(..., gt=0)
    total_amount: Decimal = Field(..., ge=0)

class OrderCreate(OrderBase):
    pass

class OrderUpdate(BaseModel):
    quantity_ordered: Optional[int] = Field(None, gt=0)
    total_amount: Optional[Decimal] = Field(None, ge=0)

class OrderResponse(OrderBase):
    id: int
    model_config = ConfigDict(from_attributes=True)
