package br.com.fiap.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.fiap.IntegrationTest;
import br.com.fiap.domain.City;
import br.com.fiap.domain.Product;
import br.com.fiap.domain.ProductDaily;
import br.com.fiap.repository.ProductDailyRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProductDailyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProductDailyResourceIT {

    private static final LocalDate DEFAULT_UPDATED_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Long DEFAULT_VALUE = 1L;
    private static final Long UPDATED_VALUE = 2L;

    private static final String ENTITY_API_URL = "/api/product-dailies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProductDailyRepository productDailyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProductDailyMockMvc;

    private ProductDaily productDaily;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductDaily createEntity(EntityManager em) {
        ProductDaily productDaily = new ProductDaily().updatedDate(DEFAULT_UPDATED_DATE).value(DEFAULT_VALUE);
        // Add required entity
        Product product;
        if (TestUtil.findAll(em, Product.class).isEmpty()) {
            product = ProductResourceIT.createEntity(em);
            em.persist(product);
            em.flush();
        } else {
            product = TestUtil.findAll(em, Product.class).get(0);
        }
        productDaily.setProduct(product);
        // Add required entity
        City city;
        if (TestUtil.findAll(em, City.class).isEmpty()) {
            city = CityResourceIT.createEntity(em);
            em.persist(city);
            em.flush();
        } else {
            city = TestUtil.findAll(em, City.class).get(0);
        }
        productDaily.setCity(city);
        return productDaily;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ProductDaily createUpdatedEntity(EntityManager em) {
        ProductDaily productDaily = new ProductDaily().updatedDate(UPDATED_UPDATED_DATE).value(UPDATED_VALUE);
        // Add required entity
        Product product;
        if (TestUtil.findAll(em, Product.class).isEmpty()) {
            product = ProductResourceIT.createUpdatedEntity(em);
            em.persist(product);
            em.flush();
        } else {
            product = TestUtil.findAll(em, Product.class).get(0);
        }
        productDaily.setProduct(product);
        // Add required entity
        City city;
        if (TestUtil.findAll(em, City.class).isEmpty()) {
            city = CityResourceIT.createUpdatedEntity(em);
            em.persist(city);
            em.flush();
        } else {
            city = TestUtil.findAll(em, City.class).get(0);
        }
        productDaily.setCity(city);
        return productDaily;
    }

    @BeforeEach
    public void initTest() {
        productDaily = createEntity(em);
    }

    @Test
    @Transactional
    void createProductDaily() throws Exception {
        int databaseSizeBeforeCreate = productDailyRepository.findAll().size();
        // Create the ProductDaily
        restProductDailyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDaily)))
            .andExpect(status().isCreated());

        // Validate the ProductDaily in the database
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeCreate + 1);
        ProductDaily testProductDaily = productDailyList.get(productDailyList.size() - 1);
        assertThat(testProductDaily.getUpdatedDate()).isEqualTo(DEFAULT_UPDATED_DATE);
        assertThat(testProductDaily.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void createProductDailyWithExistingId() throws Exception {
        // Create the ProductDaily with an existing ID
        productDaily.setId(1L);

        int databaseSizeBeforeCreate = productDailyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProductDailyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDaily)))
            .andExpect(status().isBadRequest());

        // Validate the ProductDaily in the database
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkUpdatedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = productDailyRepository.findAll().size();
        // set the field null
        productDaily.setUpdatedDate(null);

        // Create the ProductDaily, which fails.

        restProductDailyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDaily)))
            .andExpect(status().isBadRequest());

        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkValueIsRequired() throws Exception {
        int databaseSizeBeforeTest = productDailyRepository.findAll().size();
        // set the field null
        productDaily.setValue(null);

        // Create the ProductDaily, which fails.

        restProductDailyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDaily)))
            .andExpect(status().isBadRequest());

        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProductDailies() throws Exception {
        // Initialize the database
        productDailyRepository.saveAndFlush(productDaily);

        // Get all the productDailyList
        restProductDailyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(productDaily.getId().intValue())))
            .andExpect(jsonPath("$.[*].updatedDate").value(hasItem(DEFAULT_UPDATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].value").value(hasItem(DEFAULT_VALUE.intValue())));
    }

    @Test
    @Transactional
    void getProductDaily() throws Exception {
        // Initialize the database
        productDailyRepository.saveAndFlush(productDaily);

        // Get the productDaily
        restProductDailyMockMvc
            .perform(get(ENTITY_API_URL_ID, productDaily.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(productDaily.getId().intValue()))
            .andExpect(jsonPath("$.updatedDate").value(DEFAULT_UPDATED_DATE.toString()))
            .andExpect(jsonPath("$.value").value(DEFAULT_VALUE.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingProductDaily() throws Exception {
        // Get the productDaily
        restProductDailyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProductDaily() throws Exception {
        // Initialize the database
        productDailyRepository.saveAndFlush(productDaily);

        int databaseSizeBeforeUpdate = productDailyRepository.findAll().size();

        // Update the productDaily
        ProductDaily updatedProductDaily = productDailyRepository.findById(productDaily.getId()).get();
        // Disconnect from session so that the updates on updatedProductDaily are not directly saved in db
        em.detach(updatedProductDaily);
        updatedProductDaily.updatedDate(UPDATED_UPDATED_DATE).value(UPDATED_VALUE);

        restProductDailyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProductDaily.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProductDaily))
            )
            .andExpect(status().isOk());

        // Validate the ProductDaily in the database
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeUpdate);
        ProductDaily testProductDaily = productDailyList.get(productDailyList.size() - 1);
        assertThat(testProductDaily.getUpdatedDate()).isEqualTo(UPDATED_UPDATED_DATE);
        assertThat(testProductDaily.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void putNonExistingProductDaily() throws Exception {
        int databaseSizeBeforeUpdate = productDailyRepository.findAll().size();
        productDaily.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductDailyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, productDaily.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productDaily))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductDaily in the database
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProductDaily() throws Exception {
        int databaseSizeBeforeUpdate = productDailyRepository.findAll().size();
        productDaily.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductDailyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(productDaily))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductDaily in the database
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProductDaily() throws Exception {
        int databaseSizeBeforeUpdate = productDailyRepository.findAll().size();
        productDaily.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductDailyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(productDaily)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductDaily in the database
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProductDailyWithPatch() throws Exception {
        // Initialize the database
        productDailyRepository.saveAndFlush(productDaily);

        int databaseSizeBeforeUpdate = productDailyRepository.findAll().size();

        // Update the productDaily using partial update
        ProductDaily partialUpdatedProductDaily = new ProductDaily();
        partialUpdatedProductDaily.setId(productDaily.getId());

        partialUpdatedProductDaily.updatedDate(UPDATED_UPDATED_DATE);

        restProductDailyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductDaily.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductDaily))
            )
            .andExpect(status().isOk());

        // Validate the ProductDaily in the database
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeUpdate);
        ProductDaily testProductDaily = productDailyList.get(productDailyList.size() - 1);
        assertThat(testProductDaily.getUpdatedDate()).isEqualTo(UPDATED_UPDATED_DATE);
        assertThat(testProductDaily.getValue()).isEqualTo(DEFAULT_VALUE);
    }

    @Test
    @Transactional
    void fullUpdateProductDailyWithPatch() throws Exception {
        // Initialize the database
        productDailyRepository.saveAndFlush(productDaily);

        int databaseSizeBeforeUpdate = productDailyRepository.findAll().size();

        // Update the productDaily using partial update
        ProductDaily partialUpdatedProductDaily = new ProductDaily();
        partialUpdatedProductDaily.setId(productDaily.getId());

        partialUpdatedProductDaily.updatedDate(UPDATED_UPDATED_DATE).value(UPDATED_VALUE);

        restProductDailyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProductDaily.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProductDaily))
            )
            .andExpect(status().isOk());

        // Validate the ProductDaily in the database
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeUpdate);
        ProductDaily testProductDaily = productDailyList.get(productDailyList.size() - 1);
        assertThat(testProductDaily.getUpdatedDate()).isEqualTo(UPDATED_UPDATED_DATE);
        assertThat(testProductDaily.getValue()).isEqualTo(UPDATED_VALUE);
    }

    @Test
    @Transactional
    void patchNonExistingProductDaily() throws Exception {
        int databaseSizeBeforeUpdate = productDailyRepository.findAll().size();
        productDaily.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProductDailyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, productDaily.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productDaily))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductDaily in the database
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProductDaily() throws Exception {
        int databaseSizeBeforeUpdate = productDailyRepository.findAll().size();
        productDaily.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductDailyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(productDaily))
            )
            .andExpect(status().isBadRequest());

        // Validate the ProductDaily in the database
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProductDaily() throws Exception {
        int databaseSizeBeforeUpdate = productDailyRepository.findAll().size();
        productDaily.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProductDailyMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(productDaily))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the ProductDaily in the database
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProductDaily() throws Exception {
        // Initialize the database
        productDailyRepository.saveAndFlush(productDaily);

        int databaseSizeBeforeDelete = productDailyRepository.findAll().size();

        // Delete the productDaily
        restProductDailyMockMvc
            .perform(delete(ENTITY_API_URL_ID, productDaily.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<ProductDaily> productDailyList = productDailyRepository.findAll();
        assertThat(productDailyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
