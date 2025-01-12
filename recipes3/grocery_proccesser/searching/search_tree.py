from collections import defaultdict
import math
from edit_distance import edit_distance




infinite_dict = lambda: defaultdict(infinite_dict)

def close_word(word1: str, word2: str):
    return math.ceil(abs(len(word1) - len(word2))*5 / len(word1)) <= 1 and edit_distance(word1, word2) < 2
        

class Tree:
    def __init__(self):
        self.root = infinite_dict()


    def insert(self, word: str):
        current = self.root
        for letter in word:
            current = current[letter]

        current['contains_word'] = True
        current['word'] = word

    def search(self, searchTerm):
        current = self.root
        for letter in searchTerm:
            if letter not in current:
                break
            current = current[letter]
            if current['contains_word']:
                return current['word']
        
        queue = [current]
        while queue:
            next_in_line = queue.pop()
            if next_in_line['contains_word'] and close_word(next_in_line['word'], searchTerm):
                return next_in_line['word']
            for key, child in next_in_line.items():
                if key not in {'contains_word', 'word'}:
                    queue.append(child)
        





tree = Tree()
tree.insert("cat")
tree.insert("bat")
tree.insert("rat")
tree.insert("bruno")

print(tree.search("ca"))  # Fuzzy match, should return "cat"
print(tree.search("bat"))  # Exact match, should return "bat"
print(tree.search("zat"))  # Fuzzy match, might return "rat"
print(tree.search("brun"))  # No match, should return None
