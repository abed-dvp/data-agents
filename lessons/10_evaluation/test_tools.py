def calculate_total(price: float, quantity: int) -> float:
    return price * quantity

def test_calculate_total():
    assert calculate_total(10, 3) == 30
