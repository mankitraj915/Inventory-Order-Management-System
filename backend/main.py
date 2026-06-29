from fastapi import FastAPI, Depends, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
import models
import schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db(request: Request):
    if not hasattr(request.state, "db"):
        request.state.db = SessionLocal()
    try:
        yield request.state.db
    finally:
        request.state.db.close()

@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    if hasattr(request.state, "db"):
        request.state.db.rollback()
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": "Conflict"}
    )

@app.post("/products", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products", response_model=list[schemas.ProductResponse])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Product).offset(skip).limit(limit).all()

@app.get("/products/{id}", response_model=schemas.ProductResponse)
def read_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Not found")
    return db_product

@app.put("/products/{id}", response_model=schemas.ProductResponse)
def update_product(id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Not found")
    update_data = product.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.delete("/products/{id}")
def delete_product(id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(db_product)
    db.commit()
    return {"detail": "Deleted"}

@app.post("/customers", response_model=schemas.CustomerResponse)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db)):
    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@app.get("/customers", response_model=list[schemas.CustomerResponse])
def read_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Customer).offset(skip).limit(limit).all()

@app.get("/customers/{id}", response_model=schemas.CustomerResponse)
def read_customer(id: int, db: Session = Depends(get_db)):
    db_customer = db.query(models.Customer).filter(models.Customer.id == id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Not found")
    return db_customer

@app.delete("/customers/{id}")
def delete_customer(id: int, db: Session = Depends(get_db)):
    db_customer = db.query(models.Customer).filter(models.Customer.id == id).first()
    if not db_customer:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(db_customer)
    db.commit()
    return {"detail": "Deleted"}

@app.post("/orders", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == order.product_id).with_for_update().first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    if db_product.quantity_in_stock < order.quantity_ordered:
        raise HTTPException(status_code=400, detail="Insufficient stock")
    db_product.quantity_in_stock -= order.quantity_ordered
    total_amount = db_product.price * order.quantity_ordered
    db_order = models.Order(
        customer_id=order.customer_id,
        product_id=order.product_id,
        quantity_ordered=order.quantity_ordered,
        total_amount=total_amount
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@app.get("/orders", response_model=list[schemas.OrderResponse])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.Order).offset(skip).limit(limit).all()

@app.get("/orders/{id}", response_model=schemas.OrderResponse)
def read_order(id: int, db: Session = Depends(get_db)):
    db_order = db.query(models.Order).filter(models.Order.id == id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Not found")
    return db_order

@app.delete("/orders/{id}")
def delete_order(id: int, db: Session = Depends(get_db)):
    db_order = db.query(models.Order).filter(models.Order.id == id).with_for_update().first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Not found")
    db_product = db.query(models.Product).filter(models.Product.id == db_order.product_id).with_for_update().first()
    if db_product:
        db_product.quantity_in_stock += db_order.quantity_ordered
    db.delete(db_order)
    db.commit()
    return {"detail": "Deleted"}
