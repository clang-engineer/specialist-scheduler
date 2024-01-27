package com.clangengineer.scheduler.web.rest

import com.clangengineer.scheduler.IntegrationTest
import com.clangengineer.scheduler.domain.User
import com.clangengineer.scheduler.repository.UserRepository
import com.clangengineer.scheduler.security.USER
import com.clangengineer.scheduler.web.rest.vm.ManagedUserVM
import jakarta.persistence.EntityManager
import org.apache.commons.lang3.RandomStringUtils
import org.assertj.core.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.transaction.annotation.Transactional

@AutoConfigureMockMvc
@IntegrationTest
class UserResourceIT {

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var em: EntityManager

    @Autowired
    private lateinit var restUserMockMvc: MockMvc

    private lateinit var user: User

    @BeforeEach
    fun initTest() {
        user = createEntity(em)
    }

    @Test
    @Transactional
    @Throws(Exception::class)
    fun createUser() {
        val databaseSizeBeforeCreate = userRepository.findAll().size
        // Create the User
        val managedUserVM = ManagedUserVM().apply {
            login = DEFAULT_LOGIN
            password = DEFAULT_PASSWORD
            firstName = DEFAULT_FIRSTNAME
            lastName = DEFAULT_LASTNAME
            email = DEFAULT_EMAIL
            activated = true
            imageUrl = DEFAULT_IMAGEURL
            langKey = DEFAULT_LANGKEY
            authorities = mutableSetOf(USER)
        }

        restUserMockMvc.perform(
            MockMvcRequestBuilders.post("/api/admin/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(convertObjectToJsonBytes(managedUserVM))
        )
            .andExpect(MockMvcResultMatchers.status().isCreated)

        assertPersistedUsers { userList ->
            // Validate the User in the database
            assertThat(userList).hasSize(databaseSizeBeforeCreate + 1)
            val testUser = userList.first { it.login == DEFAULT_LOGIN }
            assertThat(testUser.login).isEqualTo(DEFAULT_LOGIN)
            assertThat(testUser.firstName).isEqualTo(DEFAULT_FIRSTNAME)
            assertThat(testUser.lastName).isEqualTo(DEFAULT_LASTNAME)
            assertThat(testUser.email).isEqualTo(DEFAULT_EMAIL)
            assertThat(testUser.imageUrl).isEqualTo(DEFAULT_IMAGEURL)
            assertThat(testUser.langKey).isEqualTo(DEFAULT_LANGKEY)
        }
    }

    companion object {

        private const val DEFAULT_LOGIN = "johndoe"
        private const val UPDATED_LOGIN = "jhipster"

        private const val DEFAULT_ID = 1L

        private const val DEFAULT_PASSWORD = "passjohndoe"
        private const val UPDATED_PASSWORD = "passjhipster"

        private const val DEFAULT_EMAIL = "johndoe@localhost"
        private const val UPDATED_EMAIL = "jhipster@localhost"

        private const val DEFAULT_FIRSTNAME = "john"
        private const val UPDATED_FIRSTNAME = "jhipsterFirstName"

        private const val DEFAULT_LASTNAME = "doe"
        private const val UPDATED_LASTNAME = "jhipsterLastName"

        private const val DEFAULT_IMAGEURL = "http://placehold.it/50x50"
        private const val UPDATED_IMAGEURL = "http://placehold.it/40x40"

        private const val DEFAULT_LANGKEY = "en"
        private const val UPDATED_LANGKEY = "fr"


        @JvmStatic
        fun createEntity(em: EntityManager?): User {
            return User(
                login = DEFAULT_LOGIN + RandomStringUtils.randomAlphabetic(5),
                password = RandomStringUtils.randomAlphanumeric(60),
                activated = true,
                email = RandomStringUtils.randomAlphabetic(5) + DEFAULT_EMAIL,
                firstName = DEFAULT_FIRSTNAME,
                lastName = DEFAULT_LASTNAME,
                imageUrl = DEFAULT_IMAGEURL,
                langKey = DEFAULT_LANGKEY
            )
        }

    }

    fun assertPersistedUsers(userAssertion: (List<User>) -> Unit) {
        userAssertion(userRepository.findAll())
    }
}