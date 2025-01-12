word1 = "hello"
word2 = "hegk"


def edit_distance(word1: str, word2: str):
    matrix = [[0 for i in range(len(word2)+1)] for i in range(len(word1)+1)]

    for i in range(len(word1) + 1):
        matrix[i][0] = i
    for j in range(len(word2) + 1):
        matrix[0][j] = j


    for i, _ in enumerate(matrix):
        if i == 0: continue
        for j, _ in enumerate(matrix[0]):
            if j == 0: continue
            
            required_edit = 0 if word1[i-1] == word2[j-1] else 1
            # closest_min = min(matrix[i-1][j], matrix[i][j-1], matrix[i-1][j-1])
            closest_set = min((i-1, j), (i, j-1), (i-1, j-1), key=lambda i_j: matrix[i_j[0]][i_j[1]])
            chosen_y, chosen_x = closest_set
            closest_min = matrix[chosen_y][chosen_x]
            # if matrix[chosen_y][chosen_x] == matrix[i][j] and (chosen_y != i and chosen_x != j):
            #     # its trying to say that its the same letter while also connecting unto a line that already used up that letter
            #     closest_min+=1
            min_so_far = float("inf")
            compare = matrix[chosen_y-1][chosen_x]
            if word1[chosen_y-1] == word1[i-1] and chosen_x == j:
                compare+=1
            compare = matrix[chosen_y][chosen_x-1]
            if  word1[chosen_y-1] == word1[i-1] and chosen_x == j:
                compare+=1
            matrix[i][j] = closest_min+required_edit
    
        

    # print(*matrix, sep="\n")
    return matrix[i][j]




print, edit_distance(word1, word2)