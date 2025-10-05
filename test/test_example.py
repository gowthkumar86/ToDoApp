
import pytest

def test_equal_or_not_equal():
    assert 1 == 1
    assert 1 != 2
    assert "hello" == "hello"
    assert "hello" != "world"

def test_is_istance():
    assert isinstance(5, int)
    assert isinstance("this is a string", str)
    assert not isinstance(5.0, int)

def test_boolean():
    validated = True
    assert validated is True
    assert not (validated is False)
    assert ("hello" == "world") is False

def test_type():
    assert type('Hello') is str
    assert type(10) is int
    assert type('World') is not int

def test_greater_and_less_than():
    assert 5 > 3
    assert 3 < 5
    assert 5 >= 5
    assert 3 <= 5
    assert not (5 < 3)
    assert not (3 > 5)

def test_list():
    my_list = [1, 2, 3, 4, 5]
    assert 3 in my_list
    assert 6 not in my_list
    assert len(my_list) == 5
    assert my_list[0] == 1
    assert my_list[-1] == 5


class Student:
    def __init__ (self, first_name : str, last_name : str, major : str, years : int):
        self.first_name = first_name
        self.last_name = last_name
        self.major = major
        self.years = years

@pytest.fixture
def default_employee():
    return Student("Jane", "Doe", "Computer Science", 3)

def test_person_initialization(default_employee):
    assert default_employee.first_name == "Jane"
    assert default_employee.last_name == "Doe"
    assert default_employee.major == "Computer Science"
    assert default_employee.years == 3

