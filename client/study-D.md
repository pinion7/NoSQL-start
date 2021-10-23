# D. 무중단 서비스 & 확장성 & RDBMS vs NoSQL

</br>

### 1. 무중단 서비스

- db가 일시적으로 다운되면?
- 과부하로 response time이 너무 길어지면?
- => 그럼 아무리 백, 프론트를 잘 짜놓았더라도 의미가 없어짐

![image](https://user-images.githubusercontent.com/83815628/138540828-d4d113b8-48c2-4793-8571-ac4c51b32fb4.png)
</br>

- 그래서 첫 CRUD시에 Replica Set(Primary 1, Secondary 2 = 총 3개 세트로 구성됨)이 진행됨
- Primary가 기본적으로 이용이 되고, 다운되면 Secondary가 대체하는 거임
- 그래서 문제가 생겨도 무중단 서비스가 이루어질 수 있는 것

</br>

### 2. 확장성

- db 설계를 비롯, 관계설정을 이용한 populate이용, 부분 문서내장방식, 인덱스 등 모든 최적화를 완료했음에도 너무 데이터 양이 많아져서 효율성이 더 개선이 안될 때는 돈을 더 써서 더 사양이 좋은 db서버 사양을 향상시켜야함.

- Vectical(수직) Scale: 그냥 더 좋은 사양을 쓰는 방법. 하지만 한계가 있음. 아무리 좋은 걸 쓴다한들 기술력에 한계는 있는 법임.

- Horizontal(수평) Scale (Sharded Cluster): 적당한 사양을 여러개 쓰는 방법. db를 수평적으로 확장하는 것은 한계가 없음. 걍 수를 늘리면 되기 때문. 그럼 CRUD가 분리가 되어서 성능 유지가 가능함. 관계형 데이터베이스에서도 적용은 가능하지만 훨씬 어렵다고 함.

- RDBMS가 그만큼 오래된 방식이기 때문인데, 수십년전엔 그렇게 많은 데이터를 처리할 일이 없었고 수평적 확장의 필요성을 못느꼈기 때문에 수직적 확장에만 집중을 한 것. 그래서 발전과정에서 수평적 확장을 고려하지 못한 부분이 많아, 현재 수평적 확장이 불가능까진 아니지만 난이도가 높은 것.

- 반면 NoSQL은 수평적 확장을 목적으로 두고 설계된 방식이기도 하기 때문에 수월함.

- RDBMS vs NoSQL 간의 id 생성 방식 비교
  - RDBMS(Auto Increment)
  - NoSQL(ObjectId: 시간 + 랜덤숫자 + Auto Increment로 구성)
  - => 단일 서버에서는 상관이 없지만, 수평적 확장으로 여러 db 서버로 분산 저장해야 한다고한다면 Auto Increment는 중복될수밖에 없음.

</br>

### 3. RDBMS vs NoSQL

![image](https://user-images.githubusercontent.com/83815628/138540833-5618c241-1902-4edc-97c8-dbb98d76be7f.png)
</br>

#### (1) 큰 차이점: CRUD

- Read의 경우: RDBMS는 복잡, NoSQL은 간단
- Create, Update, Delete의 경우: RDBMS는 간단, NoSQL은 복잡

#### (2) Read 성능

- NoSQL는 그냥 id값 하나에 접근하면 바로 뽑아서 반환.
- RDBMS는 단순한 읽기도 SQL 언어로 내부적인 처리가 많이 들어감. 이를 보완하기 위해 쿼리문 자체에 해당하는 결과값을 캐시 메모리에 저장하여 활용하는 방식을 많이 씀. (ex) redis)
- 문서내장(Nesting) >>> SQL > Aggregate 순으로 성능이 우수함.
- Aggregate는 몽고디비의 SQL 언어라고 보면됨

#### (3) Read 유연함

- SQL === Aggregate >>> 문서내장(Nesting)
- 마음대로 조합하고 가공하는 건 역시 Nesting은 어렵기 때문

#### (4) MongoDB를 활용하면 두마리 토끼를 어느정도 잡는 것도 가능함

![image](https://user-images.githubusercontent.com/83815628/138540829-56ae956c-71dc-47f0-827d-875735ee394e.png)
)
</br>

- API server에는 Nesting을 사용하면 됨
- Data Engineering의 경우엔 Aggregate를 쓰면 됨
- 물론 필요에 따라 API server에서도 Aggregate를 사용할 수 있지만, 적은 데이터를 다루는 일이 아니라면 비효율적. 되도록 안쓰는게 맞는듯.

#### (5) Consistency

- 데이터를 입력할 때 RDBMS는 그냥 해당하는 테이블에만 데이터를 넣으면 됨. 그렇게만 해도 일관성이 보장됨. (다 관계로 핸들링이 되기 때문)
- 반면 MongoDB는 내장하거나 복제한 부분에 대해서, 양쪽 콜렉션에서 각각 다 개발자가 일일이 데이터를 저장하는 로직을 세심히 구현해줘야함. 안그러면 일관성이 보장되지 않음.
- 상황에 따른 노하우가 필요한 게 NoSQL
