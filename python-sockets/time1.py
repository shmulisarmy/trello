from collections import defaultdict
import time



MINUTE = 60


timed_events = defaultdict(list)


print(time.time())
time.sleep(1)
print(time.time())
def set_timer(time_amount: int, message: str):
    timed_events[time.time() + time_amount].append(message)




set_timer(5, "hello world")
set_timer(10, "fuck you world")



while True:
    for key, value in timed_events.items():
        if time.time() >= key:
            for message in value:
                print(message)
            timed_events[key] = [""]
        time.sleep(.5)