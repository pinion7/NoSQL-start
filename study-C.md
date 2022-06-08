# C. 데이터베이스 Transaction 학습

- Transaction은 ACID를 지켜야할 때 사용되는 것

</br>

### 1. ACID

- Atomicity(원자성): 모두 성공해야함. 하나라도 실패하면 처음으로 롤백
- Consistency(일관성): 항상 일관된 방식으로 처리
- Isolated(독립성): 각각을 호출을 독립적으로 처리
- Durability(보장성): 하드디스크에 영구적 저장을 보장

</br>

### 2. 설명

- 만약 find 이후 save를 통해 업데이트 한다고 가정했을 때, 여러 호출이 동시다발적으로 진행된다면, find로 save가 이루어지는 과정이 완료되기 이전에, 다른 호출에서 find를 또 하게됨으로써 save되지 못한 값을 find하게 됨.

</br>

### 3. 예시 (적절한 예시가 아닐 수 있지만 find -> save 로직이라 가정한다면)

- 가령 게시글 조회수가 10인 게시물을 두번 조회하면 12가 되어야함. 하지만 Transaction이 미적용이라면 count가 10일때를 2번 호출하여 결과적으로 count가 11로 마무리됨.

</br>

### 4. 결론

- Transaction이 적용되면 ACID를 지킬 수 있음
- 하지만 Transaction을 사용하면 아무래도 성능은 떨어짐. 안 써도 괜찮다면 사실 안쓰는게 효율적
