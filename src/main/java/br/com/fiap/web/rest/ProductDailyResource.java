package br.com.fiap.web.rest;

import br.com.fiap.domain.ProductDaily;
import br.com.fiap.repository.ProductDailyRepository;
import br.com.fiap.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.com.fiap.domain.ProductDaily}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ProductDailyResource {

    private final Logger log = LoggerFactory.getLogger(ProductDailyResource.class);

    private static final String ENTITY_NAME = "productDaily";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProductDailyRepository productDailyRepository;

    public ProductDailyResource(ProductDailyRepository productDailyRepository) {
        this.productDailyRepository = productDailyRepository;
    }

    /**
     * {@code POST  /product-dailies} : Create a new productDaily.
     *
     * @param productDaily the productDaily to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productDaily, or with status {@code 400 (Bad Request)} if the productDaily has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/product-dailies")
    public ResponseEntity<ProductDaily> createProductDaily(@Valid @RequestBody ProductDaily productDaily) throws URISyntaxException {
        log.debug("REST request to save ProductDaily : {}", productDaily);
        if (productDaily.getId() != null) {
            throw new BadRequestAlertException("A new productDaily cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ProductDaily result = productDailyRepository.save(productDaily);
        return ResponseEntity
            .created(new URI("/api/product-dailies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /product-dailies/:id} : Updates an existing productDaily.
     *
     * @param id the id of the productDaily to save.
     * @param productDaily the productDaily to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productDaily,
     * or with status {@code 400 (Bad Request)} if the productDaily is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productDaily couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/product-dailies/{id}")
    public ResponseEntity<ProductDaily> updateProductDaily(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ProductDaily productDaily
    ) throws URISyntaxException {
        log.debug("REST request to update ProductDaily : {}, {}", id, productDaily);
        if (productDaily.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productDaily.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productDailyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ProductDaily result = productDailyRepository.save(productDaily);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productDaily.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /product-dailies/:id} : Partial updates given fields of an existing productDaily, field will ignore if it is null
     *
     * @param id the id of the productDaily to save.
     * @param productDaily the productDaily to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productDaily,
     * or with status {@code 400 (Bad Request)} if the productDaily is not valid,
     * or with status {@code 404 (Not Found)} if the productDaily is not found,
     * or with status {@code 500 (Internal Server Error)} if the productDaily couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/product-dailies/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<ProductDaily> partialUpdateProductDaily(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ProductDaily productDaily
    ) throws URISyntaxException {
        log.debug("REST request to partial update ProductDaily partially : {}, {}", id, productDaily);
        if (productDaily.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, productDaily.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!productDailyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ProductDaily> result = productDailyRepository
            .findById(productDaily.getId())
            .map(
                existingProductDaily -> {
                    if (productDaily.getUpdatedDate() != null) {
                        existingProductDaily.setUpdatedDate(productDaily.getUpdatedDate());
                    }
                    if (productDaily.getValue() != null) {
                        existingProductDaily.setValue(productDaily.getValue());
                    }

                    return existingProductDaily;
                }
            )
            .map(productDailyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productDaily.getId().toString())
        );
    }

    /**
     * {@code GET  /product-dailies} : get all the productDailies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of productDailies in body.
     */
    @GetMapping("/product-dailies")
    public List<ProductDaily> getAllProductDailies() {
        log.debug("REST request to get all ProductDailies");
        return productDailyRepository.findAll();
    }

    /**
     * {@code GET  /product-dailies/:id} : get the "id" productDaily.
     *
     * @param id the id of the productDaily to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productDaily, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/product-dailies/{id}")
    public ResponseEntity<ProductDaily> getProductDaily(@PathVariable Long id) {
        log.debug("REST request to get ProductDaily : {}", id);
        Optional<ProductDaily> productDaily = productDailyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(productDaily);
    }

    /**
     * {@code DELETE  /product-dailies/:id} : delete the "id" productDaily.
     *
     * @param id the id of the productDaily to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/product-dailies/{id}")
    public ResponseEntity<Void> deleteProductDaily(@PathVariable Long id) {
        log.debug("REST request to delete ProductDaily : {}", id);
        productDailyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
