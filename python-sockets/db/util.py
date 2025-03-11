def recursive_json_display(data, indent=0):
    """
    Recursively displays JSON-like data with indentation.

    Args:
        data: The data to display (can be a dictionary, list, tuple, or primitive).
        indent: The current indentation level (number of spaces).
    """
    if isinstance(data, (list, tuple)):
        print() # add a newline if the value is a complex type
        for item in data:
            recursive_json_display(item, indent)  # Keep the same indent for items in a list/tuple
    elif isinstance(data, dict):
        print() # add a newline if the value is a complex type
        for key, value in data.items():
            print(f"{indent * ' '}{key}: ", end="") # print the key and colon, but don't add a newline yet.
            if isinstance(value, (list, tuple, dict)):
                recursive_json_display(value, indent + 2) # indent nested complex types
            else:
                print(value) # print simple value and add a newline.
    else:
        print(f"{indent * ' '}{data}") # print simple value with current indent



def recursive_same_except_for(json1: [ dict | list], json2: [dict | list], exception_keys: list[str] = []) -> bool:
    if isinstance(json1, list) and isinstance(json2, list):
        for i in range(len(json1)):
            if not recursive_same_except_for(json1[i], json2[i], exception_keys):
                return False
        return True
    for key in json1:
        if key in exception_keys:
            continue
        if key not in json2:
            print( f"{red('the data')} {json2} {red('does not contain')} {key} {red('from')} {json1}") 
            return False
        if isinstance(json1[key], dict) and isinstance(json2[key], dict):
            if not recursive_same_except_for(json1[key], json2[key], exception_keys):
                return False
        elif isinstance(json1[key], list) and isinstance(json2[key], list):
            if not recursive_same_except_for(json1[key], json2[key], exception_keys):
                return False
        else:
            if json1[key] != json2[key]:
                print( f"{red('using key')}: {key}, {json2[key]} {red('does not equal')} {json1[key]}" )
                return False
    return True

def red(text: str):
    return f"\033[91m{text}\033[0m"

def green(text: str):
    return f"\033[92m{text}\033[0m"


def yellow(text: str):
    return f"\033[93m{text}\033[0m"


def blue(text: str):
    return f"\033[94m{text}\033[0m"


def magenta(text: str):
    return f"\033[95m{text}\033[0m"


def cyan(text: str):
    return f"\033[96m{text}\033[0m"


def test_recursive_same_except_ids():
    assert  recursive_same_except_for(
    {'name': 'shmuli', 'age': 12, 
    'children': [
        {'name': 'lebin', 'age': 2}

    ]}, 
    {'name': 'shmuli', 'age': 12, 
    'children': [
        {'name': 'lebin', 'age': 2}

    ]}
    ) 


    assert not recursive_same_except_for(
    {'name': 'shmuli', 'age': 12, 
    'children': [
        {'name': 'lebin', 'age': 3}

    ]}, 
    {'name': 'shmuli', 'age': 12, 
    'children': [
        {'name': 'lebin', 'age': 2}

    ]}
    ) 


test_recursive_same_except_ids()
